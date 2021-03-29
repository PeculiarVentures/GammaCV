/* eslint-disable */
import React from 'react';
import { HighlightCode } from 'lib-react-components';
import ReactMarkdown from 'react-markdown';
import PropTypes from 'prop-types';
import gfm from 'remark-gfm';
import slug from 'remark-slug';
import Link from 'next/link';
import clx from 'classnames';
import { Footer } from '../../components';
import s from './index.module.sass';

interface IDocsPageProps {
  data: DocDataType;
  id: string;
}

export const DocsPage: React.FC<IDocsPageProps> = (props) => {
  const { data, id } = props;

  return (
    <main
      className={s.main}
    >
      <div className={s.m_width}>
        <div className={clx(s.doc, 'b1', 'text_black')}>
          <ReactMarkdown
            allowDangerousHtml
            children={data}
            plugins={[gfm, slug]}
            renderers={{
              code: ({ value, language }) => {
                return (
                  <HighlightCode lang={language}>
                    {value}
                  </HighlightCode>
                );
              },
              heading: ({ level, children, node }) => {
                if (level === 6) {
                  return (
                    <h6 className="text_grey c1" children={children} />
                  );
                }

                const { id: idProp } = node.data;

                return React.createElement(`h${level}`, {}, (
                  <>
                    <a className={s.anchor_link} id={idProp}></a>
                    <Link
                      href={{
                        hash: idProp,
                        pathname: '/docs/[id]',
                        query: { id },
                      }}
                    >
                      <a
                        aria-hidden={true}
                        aria-label="anchor"
                        className={s.anchor_link_style}
                      >
                        <img src="/static/images/anchor.svg" />
                      </a>
                    </Link>
                    {children}
                  </>
                ));
              },
              tableHead: () => null,
              link: ({ href, children }) => {
                return (
                  <Link href={href}>
                    <a className="text_primary">
                      {children}
                    </a>
                  </Link>
                );
              },
              inlineCode: ({ children }) => {
                return (
                  <code className={clx("fill_light_grey", s.doc_code)}>
                    {children}
                  </code>
                );
              },
            }}
          />
        </div>
      </div>
      <Footer />
    </main>
  );
};

DocsPage.contextTypes = {
  intl: PropTypes.shape({
    getText: PropTypes.func,
  }),
};
