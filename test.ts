import * as gm from './lib';

const input = new gm.Tensor('float32', [10, 10, 4]);

// adaptive_threshold
gm.adaptiveThreshold(input, 5, 20, 0, input);
// canny_edges
gm.cannyEdges(input, 100, 200);
// cast
gm.cast(input, 'uint8');
// color_segmentation
gm.colorSegmentation(input, 3);
// concat
gm.concat(input, input, ['1.r']);
// conv2d
gm.conv2d(input, input, 1, 1)
// dilate
gm.dilate(input, [2, 2]);
// downsample
gm.downsample(input);
// erode
gm.erode(input, [2, 2], false);
// gaussian_blur
gm.gaussianBlur(input, 3, 2);
// grayscale
gm.grayscale(input);
// histogram
gm.histogram(input);
// histogram_euqalization
gm.histogramEqualization(input);
// hog
// hsv_color
// math
// mean_std
// min_max
// morphology_ex
// motion_detect
// norm
// pclines
// perspective_projection
// sat
// skin_test
// sliding_window
// sobel_operator
// swt
// threshold
// transformation_matrix
// upsample
