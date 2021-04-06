import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import { DocsPage } from '../../src/pages';

const Doc = (props, context) => {
  const { id, data, classRefs } = props;
  const { intl } = context;

  return (
    <>
      <Head>
        <title>
          {intl.getText('operations', undefined, id)}
          {' '}
          - GammaCV
        </title>
      </Head>
      <DocsPage
        data={data}
        id={id}
        classRefs={classRefs}
      />
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
  const data = (await import(`../../sources/docs/_data/${context.params.id}.md`)).default;
  const classRefs = (await import('../../sources/docs/_data/classRefs.json')).default;

  return {
    props: {
      id: context.params.id,
      data,
      classRefs,
    },
  };
}

Doc.contextTypes = {
  intl: PropTypes.shape({
    getText: PropTypes.func,
  }),
};

export default Doc;
