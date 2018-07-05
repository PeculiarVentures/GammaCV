import RegisterOperation from '../../program/operation_register';
import kernel from './kernel.glsl';

export default (tPoints, tDstPoints) => new RegisterOperation('TransformationMatrix')
  .Input('tPoints', 'float32')
  .Input('tDstPoints', 'float32')
  .Output('float32')
  .LoadChunk('pickValue')
  .Uniform('uWidth', 'float', tPoints.shape[1])
  .Uniform('uHeight', 'float', tPoints.shape[0])
  .SetShapeFn(() => [3, 1, 4])
  .GLSLKernel(kernel)
  .Compile({ tPoints, tDstPoints });
