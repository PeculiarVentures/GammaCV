/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { IntlWrapper } from 'lib-pintl';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { Header, Footer, Sidebar } from '../src/components';
import { useMediaQuery } from '../src/utils/use_media_query';
import config from '../sources/docs/config.json';
import en from '../locales/en.json';
import './reset.sass';

class UserMediaProvider extends React.Component<{ match: boolean }> {
  getChildContext() {
    const { match } = this.props;

    return { match };
  }

  render() {
    const { children } = this.props;
    return children;
  }
}

UserMediaProvider.childContextTypes = {
  match: PropTypes.bool,
};

// const childContextTypes = {
//   match: PropTypes.bool,
// };

// Object.assign(UserMediaProvider, { childContextTypes });

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
        <title>GammaCV</title>
        <meta name="description" content="GammaCV is a WebGL accelerated Computer Vision library for modern web applications." />
        <meta name="Keywords" content="computer vision, WebGL, javascript" />

        <link rel="icon" href="/static/manifest/favicon.ico" />
        <link rel="apple-touch-icon" href="/static/manifest/apple-touch-icon.png" />
        <link rel="manifest" href="/static/manifest/manifest.webmanifest" />

        <noscript>You need to enable JavaScript to run this app.</noscript>
      </Head>
      <IntlWrapper messages={en}>
        <UserMediaProvider match={match}>
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
        </UserMediaProvider>
      </IntlWrapper>
    </>
  );
}
