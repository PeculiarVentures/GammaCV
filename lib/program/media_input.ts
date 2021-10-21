import GraphNode from './graph_node';
import * as utils from '../utils';

export default class MediaInput extends GraphNode {
  // TODO: need access modifier
  dtype: DType;
  inputKeys: any[];
  isInitialized:  boolean;
  lastCtx: number;
  cache: boolean;

  media: HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas;

  public shape: number[];

  // TODO: HTMLVideoElement | HTMLCanvasElement -> MediaInputType
  constructor(media: HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas, shape: number[]) {
    super('MediaInput');

    this.dtype = 'uint8';
    this.inputKeys = [];
    this.isInitialized = false;
    this.lastCtx = Math.random();
    this.cache = true;

    this.assignMedia(media, shape);
  }

  assignMedia(media?: HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas, shape?: number[]) {
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

    // TODO: do we need to change it if no arguments passed?
    this.media = media;
    this.shape = shape;
  }
}
