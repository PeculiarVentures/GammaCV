import GraphNode from './graph_node';
import * as utils from '../utils';

export default class MediaInput extends GraphNode {
  public dtype: DType;
  public media: HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas;
  public isInitialized:  boolean;
  public shape: number[];

  constructor(media: HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas, shape: number[]) {
    super('MediaInput');

    this.dtype = 'uint8';
    this.isInitialized = false;

    this.assignMedia(media, shape);
  }

  public assignMedia(media: HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas, shape: number[]) {
    if (media) {
      utils.assert(
        utils.isVideoElement(media) || utils.isCanvasElement(media),
        'MediaInput: Is only Video, Canvas element available as input',
      );
    }

    if (shape) {
      utils.assert(
        utils.isValidShape(shape),
        'MediaInput: Shape is invalid',
      );
    }

    this.media = media;
    this.shape = shape;
  }
}
