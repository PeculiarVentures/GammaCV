/* eslint-disable */
import React from 'react';
import { HighlightCode } from 'lib-react-components';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import slug from 'remark-slug';
import Link from 'next/link';
import clx from 'classnames';
import { Sidebar } from './sidebar';
import s from './index.module.sass';

interface IDocsPageProps {
  config: IDocGroup[];
  data: DocDataType;
  id: string;
}

export const DocsPage: React.FC<IDocsPageProps> = (props) => {
  const { config, data, id } = props;

  return (
    <>
      <Sidebar
        config={config}
      />

      <section
        className={s.root}
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

                  return React.createElement(`h${level}`, { id: idProp }, (
                    <>
                      <Link
                        href={{
                          hash: idProp,
                          query: { id },
                        }}
                      >
                        <a>=</a>
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
                    <code
                      className="fill_light_grey round_small"
                      style={{
                        padding: '0 7px',
                      }}
                    >
                      {children}
                    </code>
                  );
                },
              }}
            />
          </div>
        </div>
      </section>
    </>
  );
};
