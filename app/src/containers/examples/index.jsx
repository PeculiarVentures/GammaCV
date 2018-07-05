import React, { Fragment } from 'react';
import Examples from '../../components/examples';
import Footer from '../../components/footer';
import EXAMPLES from '../../examples/index.json';

const ExamplesContainer = () => (
  <Fragment>
    <Examples
      examples={EXAMPLES}
    />
    <Footer />
  </Fragment>
);

export default ExamplesContainer;
