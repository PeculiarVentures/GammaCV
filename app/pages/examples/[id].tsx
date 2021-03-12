import { useState, useEffect } from 'react';
import { DeviceProvider } from 'lib-react-components';
import Head from 'next/head';

const Example = (props) => {
  const { id } = props;
  const [exampleData, setExampleData] = useState({});
  const [examplePage, setExamplePage] = useState({});

  useEffect(async () => {
    const example = (await import(`../../sources/examples/${id}.js`));
    const page = (await import('../../src/pages/example'));

    setExampleData(example);
    setExamplePage(page);
  }, [id]);

  const isLoading = !exampleData['default'] || !examplePage['default'];

  const renderContent = () => {
    if (isLoading) {
      return (
        <h1>
          Loading - {id}
        </h1>
      );
    }

    const ExamplePage = examplePage['default'];

    return (
      <DeviceProvider>
        <ExamplePage
          data={exampleData['default']}
          exampleName={id}
        />
      </DeviceProvider>
    );
  };

  return (
    <>
      <Head>
        <title>
          {id} - GammaCV
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
