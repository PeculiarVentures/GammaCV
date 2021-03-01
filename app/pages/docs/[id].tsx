import Link from 'next/link';
import Head from 'next/head';

const Doc = (props) => {
  return (
    <>
      <Head>
        <title>{props.id} - GammaCV</title>
      </Head>
      <div
        style={{
          display: 'flex',
        }}
      >
        <aside>
          {props.list.map((item, key) => (
            <div key={key}>
              <Link
                href={`/docs/${item.name}`}
              >
                {item.name}
              </Link>
            </div>
          ))}
        </aside>
        <main
          style={{
            flex: 1,
          }}
        >
          <h1>
            Hello {props.id}
          </h1>
        </main>
      </div>
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
  const list = config.reduce((res, group) => res.concat(group.children), []);
  const data = (await import(`../../sources/docs/_data/${context.params.id}.json`)).default;

  return {
    props: {
      id: context.params.id,
      data,
      list,
    },
  };
}

export default Doc;
