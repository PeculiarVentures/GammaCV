import Head from 'next/head';
import { IntlWrapper } from 'lib-pintl';
import en from '../locales/en.json';
import './reset.sass';

export default function MyApp({ Component, pageProps }) {
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
      </Head>
      <IntlWrapper messages={en}>
        <header>
          Header
        </header>
        <Component {...pageProps} />
        <footer>
          Footer
        </footer>
      </IntlWrapper>
    </>
  );
};
