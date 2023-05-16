import React from 'react';
import Document, {
  Html,
  Head,
  Main,
  NextScript,
} from 'next/document';

function Analytics() {
  return (
    <>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GOOGLE_ANALYTICS}`} />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag() {
              dataLayer.push(arguments);
            }
            gtag('js', new Date());
            gtag('config', '${process.env.GOOGLE_ANALYTICS}');
          `,
        }}
      />
    </>
  );
}

function Rollbar() {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            var _rollbarConfig = {
              accessToken: '${process.env.ROLLBAR_API_KEY}',
              captureUncaught: true,
              captureUnhandledRejections: true,
              payload: {
                environment: 'production',
              },
            };
          `,
        }}
      />
      <script async src="https://cdn.rollbar.com/rollbarjs/refs/tags/v2.21.0/rollbar.min.js" />
    </>
  );
}

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);

    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet" />

          <link rel="stylesheet" href="/static/theme.css" />
          <script
            dangerouslySetInnerHTML={{
              __html: '// Disable analytic for "helpukrainewinwidget", since it doesn\'t work properly \n window.__HELPUKRAINEWIDGET_DISABLE_ANALYICS = true;',
            }}
          />
          <script
            id="help-ukraine-win"
            async
            // eslint-disable-next-line max-len
            src="https://helpukrainewinwidget.org/cdn/widget.js?type=one&position=bottom-right&layout=collapsed"
          />
        </Head>
        <body>
          <Main />
          <NextScript />

          {process.env.GOOGLE_ANALYTICS ? (
            <Analytics />
          ) : null}
          {process.env.ROLLBAR_API_KEY ? (
            <Rollbar />
          ) : null}
        </body>
      </Html>
    );
  }
}

export default MyDocument;
