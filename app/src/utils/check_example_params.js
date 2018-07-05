export default function checkExample(example, exampleName) {
  const {
    tick, init, op, params,
  } = example;

  if (tick && typeof tick !== 'function') {
    throw new Error(`Error in ${exampleName} example: tick must be a function`);
  }

  if (init && typeof init !== 'function') {
    throw new Error(`Error in ${exampleName} example: init must be a function`);
  }

  if (op && typeof op !== 'function') {
    throw new Error(`Error in ${exampleName} example: op must be a function`);
  }

  if (params && (typeof params !== 'object' || Array.isArray(params))) {
    throw new Error(`Error in ${exampleName} example: params must be an object`);
  }
}
