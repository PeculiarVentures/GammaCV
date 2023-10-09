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
  const renderers = {
    code: ({ value, language }) => (
      <HighlightCode lang={language}>
        {value}
      </HighlightCode>
    ),
    heading: ({ level, children, node }) => {
      const { value, children: childs } = node.children.find(({ type }) => type === 'text' || type === 'strong');
      const idProp = value ? value : childs[0].value;

      if (level === 6) {
        return (
          <h6
            className={clx('text_grey', 'c1', s[idProp.toLowerCase()])}
            children={children}
          />
        );
      }

      return React.createElement(`h${level}`, {}, (
        <>
          <a className={s.anchor_link} id={idProp.replace(/ /g, '')}></a>
          <Link
            legacyBehavior
            href={{
              hash: idProp.replace(/ /g, ''),
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
    link: ({ href, children }) => (
      <Link href={href} legacyBehavior>
        <a className="text_primary">
          {children}
        </a>
      </Link>
    ),
    inlineCode: ({ children }) => (
      <code className={clx("fill_light_grey", s.doc_code)}>
        {children}
      </code>
    ),
  };

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
            renderers={renderers}
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
