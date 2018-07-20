import * as gm from '../lib';

export function visualize(tensor, scale = 1) {
  const debugCanvas = document.createElement('canvas');

  debugCanvas.height = tensor.shape[0];
  debugCanvas.width = tensor.shape[1];
  debugCanvas.style.height = `${tensor.shape[0] * scale}px`;
  debugCanvas.style.width = `${tensor.shape[1] * scale}px`;

  gm.canvasFromTensor(debugCanvas, tensor);

  document.body.appendChild(debugCanvas);

  return debugCanvas;
}

export function logTensorAsTable(tensor, channel = 0) {
  const table = [];

  for (let y = 0; y < tensor.shape[0]; y += 1) {
    const raw = [];

    for (let x = 0; x < tensor.shape[1]; x += 1) {
      if (tensor.shape.length === 3) {
        raw.push(tensor.get(y, x, channel));
      } else if (tensor.shape.length === 2) {
        raw.push(tensor.get(y, x));
      } else {
        throw new Error(`Unable logTensorAsTable for shape [${tensor.shape}]`);
      }
    }
    table.push(raw);
  }

  console.table(table);
}

export function imageDiff(input, output) {
  const result = new gm.Tensor('uint8', input.shape);

  for (let y = 0; y < input.shape[0]; y += 1) {
    for (let x = 0; x < input.shape[1]; x += 1) {
      if (
        input.get(y, x, 0) !== output.get(y, x, 0) ||
        input.get(y, x, 1) !== output.get(y, x, 1) ||
        input.get(y, x, 2) !== output.get(y, x, 2) ||
        input.get(y, x, 3) !== output.get(y, x, 3)
      ) {
        result.set(y, x, 0, 255);
        result.set(y, x, 3, 255);
      }
    }
  }

  return result;
}
