import { useState, useEffect, lazy, Suspense } from 'react';
import Head from 'next/head';

const Example = (props) => {
  const [data, setData] = useState({});

  useEffect(() => {
    if (data) {
      getData();
    }
  }, []);

  const getData = async () => {
    const _data = (await import(`../../sources/examples/${props.id}.js`));

    setData(_data);
  };

  const isLoading = !data['default'];

  const renderX = () => {
    const ExamplePage = lazy(() => import('../../src/pages/example'));
    const dataDefault = data['default']
    const op = dataDefault['op'];
    const tick = dataDefault['tick'];
    const init = dataDefault['init'];

    return (
      <Suspense fallback={(<div>isLoading</div>)}>
        <ExamplePage
          op={op}
          tick={tick}
          init={init}
          params={data['default']['params']}
        />
      </Suspense>
    );
  };

  return (
    <>
      <Head>
        <title>{props.id} - GammaCV</title>
      </Head>
      {isLoading ? (
        <h1>
          Loading - {props.id}
        </h1>
      ) : renderX()
      }
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
