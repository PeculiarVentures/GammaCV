/**
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @license MIT
 */

import RegisterOperation from '../../program/operation_register';
import Tensor from '../../program/tensor';
import kernel from './kernel.glsl';
import * as utils from '../../utils';

/**
 * @name ColorSegmentation
 * @description
 *  Color segmentation of given image with simple Euclidian
 *  distance estimation.
 * @example
 *  // segmentation of input image to 5 clusters
 *  colorSegmentation(inputImage, 5);
 * @param {Tensor} tSrc - Current frame.
 * @param {number} clusters - Number of clusters the input image to be clustered.
 */

export default (tSrc, clusters = 3) => {
  utils.assert(
    tSrc.dtype === 'uint8',
    'Color Segmentation currently available for uint8 image input',
  );

  utils.assert(
    clusters > 1,
    'Number of clusters should be greater than 1',
  );

  return new RegisterOperation('ImageColorSegmentation')
    .Input('tSrc', 'uint8')
    .Input('tCentroids', 'uint8')
    .Output('uint8')
    .LoadChunk('pickValue')
    .Constant('CLUSTERS', clusters)
    .GLSLKernel(kernel)
    .PreCompile((op) => {
      const k = ~~(256 / clusters);

      op.centroids = new Tensor('uint8', [clusters, 1, 4]);

      for (let i = 0; i < clusters; i += 1) {
        op.centroids.set(i, 0, 0, i * k);
      }

      op.assignInput('tCentroids', op.centroids);
    })
    .Compile({ tSrc });
};
