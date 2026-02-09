import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import type { IntlContext } from 'lib-pintl';
import { DocsPage } from '../../src/pages';

const Doc = (props: any, context: { intl: IntlContext }) => {
  const { id, data } = props;
  const { intl } = context;
  const TITLE = `${intl.getText('operations', undefined, id)} - GammaCV`;

  return (
    <>
      <Head>
        <title>
          {TITLE}
        </title>
        <meta name="twitter:title" content={TITLE} key="twitter:title" />
        <meta property="og:title" content={TITLE} key="og:title" />
      </Head>
      <DocsPage
        data={data}
        id={id}
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

  return {
    props: {
      id: context.params.id,
      data,
    },
  };
}

Doc.contextTypes = {
  intl: PropTypes.shape({
    getText: PropTypes.func,
  }),
};

export default Doc;
