/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

// TODO: create an issue that need to remove deprecated API
 declare const navigator: Navigator & {
  getUserMedia: (constraints?: MediaStreamConstraints, successCallback?: (stream: MediaStream) => void) => void;
  webkitGetUserMedia?: (constraints?: MediaStreamConstraints, successCallback?: (stream: MediaStream) => void) => void;
  mozGetUserMedia?: (constraints?: MediaStreamConstraints, successCallback?: (stream: MediaStream) => void) => void;
  msGetUserMedia?: (constraints?: MediaStreamConstraints, successCallback?: (stream: MediaStream) => void) => void;
  oGetUserMedia?: (constraints?: MediaStreamConstraints, successCallback?: (stream: MediaStream) => void) => void;
}

 declare const window: Window & {
  offsetWidth?: number;
  offsetHeight?: number;
}

import Tensor from '../program/tensor';
import { getCanvas, getVideo } from '../utils';
/**
 *
 * @param {Ratio} r
 * @param {number} height
 */
function getWidth(r: number, h: number) {
  return r * h;
}

/**
 *
 * @param {Ratio} r
 * @param {number} width
 */
function getHeight(r: number, w: number) {
  return w / r;
}

/**
 *
 * @param {Ratio} r
 * @param {number} maxWidth
 * @param {number} [maxHeight]
 * @return {Size}
 */
function getMaxAvailableSize(r: number, maxWidth: number, maxHeight: number) {
  if (maxWidth) {
    const _height = getHeight(r, maxWidth);

    if (_height <= maxHeight) {
      return {
        width: maxWidth,
        height: _height,
      };
    }
  }

  return {
    width: getWidth(r, maxHeight),
    height: maxHeight,
  };
}

/**
 *
 * @param {Ratio} r
 * @param {number} minWidth
 * @param {number} [minHeight]
 * @return {Size}
 */
function getMinAvailableSize(r: number, minWidth: number, minHeight: number) {
  if (minWidth) {
    const _height = getHeight(r, minWidth);

    if (_height > minHeight) {
      return {
        width: minWidth,
        height: _height,
      };
    }
  }

  return {
    width: getWidth(r, minHeight),
    height: minHeight,
  };
}

type TCanvasElement = HTMLCanvasElement | OffscreenCanvas;
type TCanvasRenderingContext = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;

export default class CaptureVideo {
  started: boolean;
  video: HTMLVideoElement;
  canvas: TCanvasElement;
  canvasCtx: TCanvasRenderingContext;
  sourceCanvas: TCanvasElement;
  sourceCanvasCtx: TCanvasRenderingContext;
  width: number;
  height: number;
  sourceWidth: number;
  sourceHeight: number;
  sourceMinWidth: number;
  sourceMinHeight: number;
  track: MediaStreamTrack | null;
  static IsAvailable() {
    const cfg = {
      video: {
        width: { min: 480, ideal: 1080, max: 1920 },
        height: { min: 480, ideal: 1080, max: 1920 },
      },
    };

    navigator.getUserMedia = navigator.getUserMedia
      || navigator.webkitGetUserMedia
      || navigator.mozGetUserMedia
      || navigator.msGetUserMedia
      || navigator.oGetUserMedia;

    const ua = navigator.userAgent;

    /* to deal with bug of hard requesting video stream width/height on Safari,
       request will be rejected if not actual webcam resolution requested
    */
    if (ua.indexOf('Safari') !== -1 && ua.indexOf('Chrome') === -1) {
      delete cfg.video.width;
      delete cfg.video.height;
    }

    let getStream: Promise<void | MediaStream> = Promise.resolve();

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      getStream = getStream.then(() => navigator.mediaDevices.getUserMedia(cfg));
    } else if (navigator.getUserMedia) {
      getStream = getStream.then(() => new Promise(res => navigator.getUserMedia(cfg, res)));
    }

    return getStream
      // @ts-ignore
      .then((stream) => {
        if (stream) {
          const tracks = stream.getTracks();
          const deviceID = tracks[0].getSettings().deviceId;

          tracks.forEach(track => track.stop());

          return deviceID || true;
        }
      })
      .catch(() => Promise.resolve(false));
  }

  static getDevices() {
    if ('mediaDevices' in navigator && 'enumerateDevices' in navigator.mediaDevices) {
      return navigator.mediaDevices.enumerateDevices()
        .then(devices => devices.filter(device => device.kind === 'videoinput'));
    }

    return Promise.resolve(null);
  }

  constructor(width: number, height: number) {
    this.video = getVideo();
    this.video.muted = true;
    this.video.playsInline = true;
    this.canvas = getCanvas();
    this.canvasCtx = this.canvas.getContext('2d');
    this.sourceCanvas = getCanvas();
    this.sourceCanvasCtx = this.sourceCanvas.getContext('2d');

    this.width = width;
    this.height = height;

    this.sourceWidth = width;
    this.sourceHeight = height;

    this.setSize(width, height);
    this.track = null;
  }

  setSize(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.canvas.width = width;
    this.canvas.height = height;
    this.sourceCanvas.width = width;
    this.sourceCanvas.height = height;
    this.sourceMinWidth = width;
    this.sourceMinHeight = height;
  }

  setSourceSize(width: number, height: number) {
    const scaledSize = getMinAvailableSize(width / height, this.width, this.height);
    const size = getMaxAvailableSize(this.width / this.height, width, height);
    const scaledMinSize = getMinAvailableSize(width / height, size.width, size.height);

    this.sourceMinWidth = scaledSize.width;
    this.sourceMinHeight = scaledSize.height;

    this.sourceWidth = scaledMinSize.width;
    this.sourceHeight = scaledMinSize.height;

    this.sourceCanvas.width = size.width;
    this.sourceCanvas.height = size.height;
  }

  getDevice() {
    if (this.track) {
      return this.track.getSettings().deviceId;
    }

    return null;
  }

  start(deviceID: string, exactFacingMode: string = '') {
    this.started = true;
    const cfg = {
      video: {
        width: { min: 240, ideal: 1080, max: 1920 },
        height: { min: 240, ideal: 1080, max: 1920 },
        aspectRatio: { exact: this.width / this.height },
        deviceId: deviceID ? deviceID : undefined,
        facingMode: exactFacingMode ? { exact: exactFacingMode } : null,
      },
    };

    const ua = navigator.userAgent;

    const isPortrait =
      !(window.orientation === -90
      || window.orientation === 90
      || window.offsetWidth > window.offsetHeight);

    if (/android/i.test(ua) && isPortrait) {
      cfg.video.aspectRatio.exact = 1 / cfg.video.aspectRatio.exact;
    }

    if (ua.indexOf('Safari') !== -1 && ua.indexOf('Chrome') === -1) {
      delete cfg.video.width;
      delete cfg.video.height;
      delete cfg.video.aspectRatio;
    }

    navigator.getUserMedia = navigator.getUserMedia
      || navigator.webkitGetUserMedia
      || navigator.mozGetUserMedia
      || navigator.msGetUserMedia
      || navigator.oGetUserMedia;

    let getStream: Promise<void | MediaStream> = Promise.resolve();


    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      getStream = getStream.then(() => navigator.mediaDevices.getUserMedia(cfg));
    } else if (navigator.getUserMedia) {
      getStream = getStream.then(() => new Promise(res => navigator.getUserMedia(cfg, res)));
    }

    return getStream.then((stream) => {
      if (stream) {
        const tracks = stream.getTracks();

        if (!this.started) {
          tracks.forEach(t => t.stop());

          return null;
        }
        if ('srcObject' in this.video) {
          this.video.srcObject = stream;
        } else {
          this.video.src = URL.createObjectURL(stream);
        }

        this.track = tracks[0];

        return this.video.play()
          .then(() => this.setSourceSize(this.video.videoWidth, this.video.videoHeight));
      }
      throw new Error('getUserMedia not found or no stream was created');
    });
  }

  stop() {
    this.started = false;
    if (this.track) {
      this.track.stop();
      this.track = null;
    }
  }

  drawImage(ctx: TCanvasRenderingContext, w: number, h: number, ow: number, oh: number) {
    ctx.drawImage(
      this.video,
      (ow - w) / -2,
      (oh - h) / -2,
      ow,
      oh,
    );
  }

  getImageBuffer(
    type: 'uint8' | 'float32' | 'uint8c' | Tensor,
    ctx: TCanvasRenderingContext = this.canvasCtx,
    width: number = this.width,
    height: number = this.height,
    x: number = 0,
    y: number = 0,
    w: number = width,
    h: number = height,
    originW: number = this.sourceMinWidth,
    originH: number = this.sourceMinHeight,
  ) {
    this.drawImage(ctx, w, h, originW, originH);
    const imgData = ctx.getImageData(x, y, w, h);

    if (type instanceof Tensor) {
      (type.data as Uint8Array).set(imgData.data);

      return type;
    }

    switch (type) {
      case 'uint8': {
        return new Uint8Array(imgData.data);
      }
      case 'uint8c': {
        return imgData.data;
      }
      case 'float32': {
        return new Float32Array(imgData.data);
      }
      default: {
        return imgData;
      }
    }
  }

  getImageBufferTo(
    _type: 'uint8' | 'float32' | Tensor,
    ctx: TCanvasRenderingContext = this.canvasCtx,
    width: number = this.width,
    height: number = this.height,
    x: number = 0,
    y: number = 0,
    w: number = width,
    h: number = height,
    to: Tensor,
  ) {
    ctx.drawImage(
      this.video,
      (this.sourceWidth - this.width) / -2,
      (this.sourceHeight - this.height) / -2,
      this.sourceWidth,
      this.sourceHeight,
    );
    const imgData = ctx.getImageData(x, y, w, h);

    to.data = (imgData.data.buffer as Uint8Array);
  }

  getSourceImageBuffer(
    type: 'uint8' | 'float32' | Tensor,
    x: number = 0,
    y: number = 0,
    w: number = this.sourceCanvas.width,
    h: number = this.sourceCanvas.height,
  ) {
    return this.getImageBuffer(
      type,
      this.sourceCanvasCtx,
      this.sourceCanvas.width,
      this.sourceCanvas.height,
      x,
      y,
      w,
      h,
      this.sourceWidth,
      this.sourceHeight,
    );
  }
}
