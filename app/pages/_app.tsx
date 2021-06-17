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
  const sidebarVisible = match ? showSidebar : isDocs;

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
        <meta name="description" content={DESCRIPTION} key="description" />
        <meta name="Keywords" content="computer vision, WebGL, javascript" key="Keywords" />

        <meta property="og:title" content={TITLE} key="og:title" />
        <meta property="og:description" content={DESCRIPTION} key="og:description" />
        <meta property="og:image" content="https://gammacv.com/static/images/share_image.png" key="og:image" />

        <meta name="twitter:card" content="summary_large_image" key="twitter:card" />
        <meta name="twitter:title" content={TITLE} key="twitter:title" />
        <meta name="twitter:description" content={DESCRIPTION} key="twitter:description" />
        <meta name="twitter:image" content="https://gammacv.com/static/images/share_image.png" key="twitter:image" />

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
        <Sidebar config={config} visible={sidebarVisible} />
        <Component {...pageProps} />
        {showFooter && (
          <Footer />
        )}
      </IntlWrapper>
    </>
  );
}
