import GraphNode from './graph_node';
import * as utils from '../utils';

export default class MediaInput extends GraphNode {
  constructor(media, shape) {
    super('MediaInput');

    this.dtype = 'uint8';
    this.inputKeys = [];
    this.isInitialized = false;
    this.lastCtx = Math.random();
    this.cache = true;

    this.assignMedia(media, shape);
  }

  assignMedia(media, shape) {
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
