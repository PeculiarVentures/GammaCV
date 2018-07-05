import React from 'react';
import { render } from 'react-dom';
import Viewport from './components/viewport';

const dispatch = () => {};

const renderToRoot = (component, lang) => {
  render(React.createElement(
    Viewport,
    { lang },
    React.createElement(component),
  ), document.getElementById('root'));
};

const renderModal = () => null;
const delegateAppController = () => null;

export {
  delegateAppController,
  renderToRoot,
  renderModal,
  dispatch,
};
