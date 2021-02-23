const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const themeConstructor = require('lib-theme-contructor');
const theme = require('../../src/themes/default');

module.exports = (name, output) => themeConstructor.createThemes([
  {
    name,
    entry: path.join(__dirname, '../../node_modules/lib-react-components/styles/index.sss'),
    out: output,
    options: theme,
  },
]);
