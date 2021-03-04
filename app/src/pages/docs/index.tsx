/* eslint-disable */
import React from 'react';
import { Typography, HighlightCode } from 'lib-react-components';
import parse, { attributesToProps, domToReact } from 'html-react-parser';
import Link from 'next/link';
import clx from 'classnames';
import { Sidebar } from './sidebar';
import s from './index.module.sass';

interface IDocsPageProps {
  config: IDocGroup[];
  data: DocDataType;
}

const options = {
  replace: (domNode) => {
    if (domNode.name === 'h6') {
      return (
        <h6 className="text_grey c1">
          {domToReact(domNode.children, options)}
        </h6>
      );
    }

    if (domNode.name === 'pre') {
      const dom = domToReact(domNode.children);

      return (
        <HighlightCode>
          {dom.props.children}
        </HighlightCode>
      );
    }

    if (domNode.name === 'code') {
      return (
        <code
          className="fill_light_grey round_small"
          style={{
            padding: '0 7px',
          }}
        >
          {domToReact(domNode.children)}
        </code>
      );
    }

    if (domNode.name === 'a') {
      return (
        <Link href={domNode.attribs.href}>
          <a className="text_primary">
            {domToReact(domNode.children)}
          </a>
        </Link>
      );
    }

    if (domNode.name === 'thead') {
      return <></>;
    }
  },
};

export const DocsPage: React.FC<IDocsPageProps> = (props) => {
  const { config, data } = props;

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
            {parse(data, options)}
          </div>
        </div>
      </section>
    </>
  );
};
