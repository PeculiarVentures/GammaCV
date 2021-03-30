import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';

const Example = (props, context) => {
  const { id } = props;
  const { intl } = context;
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
      <ExamplePage
        data={exampleData.default}
        exampleName={id}
      />
    );
  };

  return (
    <>
      <Head>
        <title>
          {intl.getText('operations', undefined, id)}
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

Example.contextTypes = {
  intl: PropTypes.shape({
    getText: PropTypes.func,
  }),
};

export default Example;
