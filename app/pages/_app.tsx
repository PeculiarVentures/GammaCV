/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { IntlWrapper } from 'lib-pintl';
import { useRouter } from 'next/router';
import { Header, Footer, Sidebar } from '../src/components';
import config from '../sources/docs/config.json';
import en from '../locales/en.json';
import './reset.sass';

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const isMain = router.pathname === '/';
  const showFooter = router.pathname === '/' || router.pathname === '/examples';
  const isDocs = router.pathname === '/docs/[id]';
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    const disableScroll = () => {
      if (document.body.scrollHeight > window.innerHeight) {
        document.body.style.marginTop = `-${window.pageYOffset}px`;
        document.body.style.position = 'fixed';
        document.body.style.overflowY = 'scroll';
      }
    };
    const enableScroll = () => {
      document.body.style.position = '';
      document.body.style.overflowY = '';

      if (document.body.style.marginTop) {
        const scrollTop = -parseInt(document.body.style.marginTop, 10);
        document.body.style.marginTop = '';
        window.scrollTo(window.pageXOffset, scrollTop);
      }
    };

    if (showSidebar) {
      disableScroll();
    } else {
      enableScroll();
    }

    const hideSidebar = () => setShowSidebar(false);

    router.events.on('routeChangeStart', hideSidebar);

    return () => {
      router.events.off('routeChangeStart', hideSidebar);
    };
  });

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
          isMain={isMain}
          displaySidebar={(state) => setShowSidebar(state)}
          showSidebar={showSidebar}
        />
        <Sidebar
          config={config}
          visible={showSidebar}
          isDocs={isDocs}
        />
        <Component {...pageProps} />
        {showFooter && (
          <Footer />
        )}
      </IntlWrapper>
    </>
  );
}
