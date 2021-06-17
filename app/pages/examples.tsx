import React from 'react';
import Head from 'next/head';
import { ExamplesPage } from '../src/pages';

const Examples = (props) => {
  const { config } = props;

  const TITLE = 'Examples - GammaCV';
  return (
    <>
      <Head>
        <title>
          {TITLE}
        </title>
        <meta name="twitter:title" content={TITLE} key="twitter:title" />
        <meta property="og:title" content={TITLE} key="og:title" />
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
