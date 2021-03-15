import React, { useState, useEffect } from 'react';
import { DeviceProvider } from 'lib-react-components';
import Head from 'next/head';

const Example = (props) => {
  const { id } = props;
  const [loading, setLoading] = useState(true);
  const [examplePage, setExamplePage] = useState<typeof import('../../src/pages/example')>({} as any);
  const [exampleData, setExampleData] = useState<{ default: any }>({} as any);

  useEffect(() => {
    Promise.all([
      import('../../src/pages/example'),
      import(`../../sources/examples/${id}.js`),
    ]).then((res) => {
      setExamplePage(res[0]);
      setExampleData(res[1]);
      setLoading(false);
    });
  });

  const renderContent = () => {
    if (loading) {
      return (
        <h1>
          Loading -
          {' '}
          {id}
        </h1>
      );
    }

    const ExamplePage = examplePage.default;

    return (
      <DeviceProvider>
        <ExamplePage
          data={exampleData.default}
          exampleName={id}
        />
      </DeviceProvider>
    );
  };

  return (
    <>
      <Head>
        <title>
          {id}
          {' '}
          - GammaCV
        </title>
      </Head>
      {renderContent()}
    </>
  );
};

export async function getStaticPaths() {
  const config = (await import('../../sources/examples/config.json')).default;
  const list = config.reduce((res, group) => res.concat(group.examples), []);

  return {
    paths: list.map((example) => ({
      params: {
        id: example.path,
      },
    })),
    fallback: false,
  };
}

export async function getStaticProps(context) {
  return {
    props: {
      id: context.params.id,
    },
  };
}

export default Example;
