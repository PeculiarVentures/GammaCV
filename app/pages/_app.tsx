import Head from 'next/head';
import { IntlWrapper } from 'lib-pintl';
import { useRouter } from 'next/router';
import clx from 'classnames';
import { Header, Footer } from '../src/components';
import en from '../locales/en.json';
import './reset.sass';

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const showFooter = router.pathname !== '/examples/[id]';

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1,maximum-scale=1,minimum-scale=1" />
        <title>GammaCV</title>
        <meta name="description" content="GammaCV is a WebGL accelerated Computer Vision library for modern web applications." />
        <meta name="Keywords" content="computer vision, WebGL, javascript" />

        <link rel="icon" href="/static/manifest/favicon.ico" />
        <link rel="apple-touch-icon" href="/static/manifest/apple-touch-icon.png" />
        <link rel="manifest" href="/static/manifest/manifest.webmanifest" />

        <noscript>You need to enable JavaScript to run this app.</noscript>
      </Head>
      <IntlWrapper messages={en}>
        <Header
          transparent={router.pathname === '/'}
        />
        <main className={clx('main', { m_full: !showFooter })}>
          <Component {...pageProps} />
        </main>
        {showFooter && (
          <Footer />
        )}
      </IntlWrapper>
    </>
  );
};
