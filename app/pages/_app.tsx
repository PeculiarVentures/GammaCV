/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { IntlWrapper } from 'lib-pintl';
import { useRouter } from 'next/router';
import { Header, Footer, Sidebar } from '../src/components';
import { useMediaQuery } from '../src/utils/use_media_query';
import config from '../sources/docs/config.json';
import en from '../locales/en.json';
import './reset.sass';

const TITLE = 'GammaCV';
const DESCRIPTION = 'GammaCV is a WebGL accelerated Computer Vision library for modern web applications.';

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const isMain = router.pathname === '/';
  const showFooter = router.pathname === '/' || router.pathname === '/examples';
  const isDocs = router.pathname === '/docs/[id]';
  const match = useMediaQuery('(max-width: 1024px)');
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    const disableScroll = () => {
      document.body.style.overflow = 'hidden';
    };
    const enableScroll = () => {
      document.body.style.overflow = 'visible';
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
        <title>
          {TITLE}
        </title>
        <meta name="description" content={DESCRIPTION} />
        <meta name="Keywords" content="computer vision, WebGL, javascript" />

        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:image" content="https://gammacv.com/static/images/share_image.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESCRIPTION} />
        <meta name="twitter:image" content="https://gammacv.com/static/images/share_image.png" />

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
        {((!match && isDocs) || showSidebar) && (
          <Sidebar config={config} />
        )}
        <Component {...pageProps} />
        {showFooter && (
          <Footer />
        )}
      </IntlWrapper>
    </>
  );
}
