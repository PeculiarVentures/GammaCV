// import Link from 'next/link';
import Head from 'next/head';
import { DocsPage } from '../../src/pages';

const Doc = (props) => {
  const { id, config, data } = props;

  return (
    <>
      <Head>
        <title>{id} - GammaCV</title>
      </Head>

      <DocsPage
        config={config}
        data={data}
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
  const config = (await import('../../sources/docs/config.json')).default;
  const data = (await import(`../../sources/docs/_data/${context.params.id}.json`)).default;

  return {
    props: {
      id: context.params.id,
      data,
      config,
    },
  };
}

export default Doc;
