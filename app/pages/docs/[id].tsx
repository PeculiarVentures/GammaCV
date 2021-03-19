import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { DeviceProvider } from 'lib-react-components';
import { DocsPage } from '../../src/pages';

const Doc = (props) => {
  const { id, config, data } = props;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  });

  if (loading) {
    return (
      <h1>
        Loading -
        {' '}
        {id}
      </h1>
    );
  }

  return (
    <>
      <Head>
        <title>
          {id}
          {' '}
          - GammaCV
        </title>
      </Head>
      <DeviceProvider>
        <DocsPage
          config={config}
          data={data}
          id={id}
        />
      </DeviceProvider>
    </>
  );
};

export async function getStaticPaths() {
  const config = (await import('../../sources/docs/config.json')).default;
  const list = config.reduce((res, group) => res.concat(group.children), []);

  return {
    paths: list.map((doc) => ({
      params: {
        id: doc.name,
      },
    })),
    fallback: false,
  };
}

export async function getStaticProps(context) {
  const config = (await import('../../sources/docs/config.json')).default;
  const data = (await import(`../../sources/docs/_data/${context.params.id}.md`)).default;

  return {
    props: {
      id: context.params.id,
      data,
      config,
    },
  };
}

export default Doc;
