/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

import Tensor from '../program/tensor';
/**
 *
 * @param {Ratio} r
 * @param {number} height
 */
function getWidth(r, h) {
  return r * h;
}

/**
 *
 * @param {Ratio} r
 * @param {number} width
 */
function getHeight(r, w) {
  return w / r;
}

/**
 *
 * @param {Ratio} r
 * @param {number} maxWidth
 * @param {number} [maxHeight]
 * @return {Size}
 */
function getMaxAvailableSize(r, maxWidth, maxHeight) {
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
function getMinAvailableSize(r, minWidth, minHeight) {
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

export class CaptureVideo {
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

    if (ua.indexOf('Safari') !== -1 && ua.indexOf('Chrome') === -1) {
      delete cfg.video.width;
      delete cfg.video.height;
    }

    let getStream = Promise.resolve();

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      getStream = getStream.then(() => navigator.mediaDevices.getUserMedia(cfg));
    } else if (navigator.getUserMedia) {
      getStream = getStream.then(() => new Promise(res => navigator.getUserMedia(cfg, res)));
    }

    return getStream
      .then((stream) => {
        const tracks = stream.getTracks();
        const deviceID = tracks[0].getSettings().deviceId;

        tracks.forEach(track => track.stop());

        return deviceID || true;
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

  constructor(width, height) {
    this.video = document.createElement('video');
    this.video.muted = true;
    this.video.playsInline = true;
    this.canvas = document.createElement('canvas');
    this.canvasCtx = this.canvas.getContext('2d');
    this.sourceCanvas = document.createElement('canvas');
    this.sourceCanvasCtx = this.sourceCanvas.getContext('2d');

    this.width = width;
    this.height = height;

    this.sourceWidth = width;
    this.sourceHeight = height;

    this.setSize(width, height);
    this.track = null;
  }

  setSize(width, height) {
    this.width = width;
    this.height = height;
    this.canvas.width = width;
    this.canvas.height = height;
    this.sourceCanvas.width = width;
    this.sourceCanvas.height = height;
    this.sourceMinWidth = width;
    this.sourceMinHeight = height;
  }

  setSourceSize(width, height) {
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

  start(deviceID, exactFacingMode = '') {
    this.started = true;
    const cfg = {
      video: {
        width: { min: 240, ideal: 1080, max: 1920 },
        height: { min: 240, ideal: 1080, max: 1920 },
        aspectRatio: { exact: this.height / this.width },
        deviceId: deviceID ? { ideal: deviceID } : undefined,
        facingMode: exactFacingMode ? { exact: exactFacingMode } : null,
      },
    };

    const ua = navigator.userAgent;

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

    let getStream = Promise.resolve();


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
          this.video.src = window.URL.createObjectURL(stream);
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

  drawImage(ctx, w, h, ow, oh) {
    ctx.drawImage(
      this.video,
      (ow - w) / -2,
      (oh - h) / -2,
      ow,
      oh,
    );
  }

  getImageBuffer(
    type,
    ctx = this.canvasCtx,
    width = this.width,
    height = this.height,
    x = 0,
    y = 0,
    w = width,
    h = height,
    originW = this.sourceMinWidth,
    originH = this.sourceMinHeight,
  ) {
    this.drawImage(ctx, w, h, originW, originH);
    const imgData = ctx.getImageData(x, y, w, h);

    if (type instanceof Tensor) {
      type.data.set(imgData.data);

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
    type,
    ctx = this.canvasCtx,
    width = this.width,
    height = this.height,
    x = 0,
    y = 0,
    w = width,
    h = height,
    to,
  ) {
    ctx.drawImage(
      this.video,
      (this.sourceWidth - this.width) / -2,
      (this.sourceHeight - this.height) / -2,
      this.sourceWidth,
      this.sourceHeight,
    );
    const imgData = ctx.getImageData(x, y, w, h);

    to.data = imgData.data.buffer;
  }

  getSourceImageBuffer(type, x, y, w, h) {
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
