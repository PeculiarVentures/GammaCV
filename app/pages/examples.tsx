import Link from 'next/link';
import Head from 'next/head';

const Examples = ({ routeList }) => {
  return (
    <>
      <Head>
        <title>Examples - GammaCV</title>
      </Head>
      <h1>
        Examples
      </h1>
      {routeList.map((item, key) => (
        <div key={key}>
          <Link
            href={`/examples/${item.path}`}
          >
            {item.path}
          </Link>
        </div>
      ))}
    </>
  );
};

export async function getStaticProps() {
  const examples = (await import('../sources/examples/config.json')).default;
  const routeList = examples.reduce((res, group) => res.concat(group.examples), []);

  return {
    props: {
      routeList,
    },
  };
}

export default Examples;
