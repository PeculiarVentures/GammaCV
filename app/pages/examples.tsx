import React from 'react';
import Head from 'next/head';
import { ExamplesPage } from '../src/pages';

const Examples = (props) => {
  const { config } = props;

  return (
    <>
      <Head>
        <title>Examples - GammaCV</title>
      </Head>

      <ExamplesPage
        config={config}
      />
    </>
  );
};

export async function getStaticProps() {
  const config = (await import('../sources/examples/config.json')).default;

  return {
    props: {
      config,
    },
  };
}

export default Examples;
