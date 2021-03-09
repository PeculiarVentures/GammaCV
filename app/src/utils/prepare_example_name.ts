import EXAMPLES from '../../sources/examples/config.json';

const PrepareExampleName = (key: string) => {
  for (let i = 0; i < EXAMPLES.length; i += 1) {
    for (let j = 0; j < EXAMPLES[i].examples.length; j += 1) {
      if (EXAMPLES[i].examples[j].path === key) {
        return EXAMPLES[i].examples[j].name;
      }
    }
  }

  return 'Undefined';
};

export default PrepareExampleName;
