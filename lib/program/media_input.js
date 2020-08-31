import GraphNode from './graph_node';
import * as utils from '../utils';

export default class MediaInput extends GraphNode {
  constructor(media, shape) {
    utils.assert(
      utils.isVideoElement(media) || utils.isCanvasElement(media),
      'MediaInput: Is only Video, Canvas element available as input',
    );
    super('MediaInput');
    this.dtype = 'uint8';
    this.media = media;
    this.inputKeys = [];
    this.isInitialized = false;
    this.lastCtx = Math.random();
    this.cache = true;
    this.shape = shape;
  }

  assignMedia(media) {
    this.media = media;
  }
}
