import React from 'react';
import { Box } from 'lib-react-components';
import Link from 'next/link';
import PropTypes from 'prop-types';
import clx from 'classnames';
import s from './index.module.sass';

interface IHeaderProps {
  isMain?: boolean;
}

export const Header: React.FC<IHeaderProps> = (props: IHeaderProps, context) => {
  const { isMain } = props;
  const { intl } = context;

  return (
    <Box
      tagType="header"
      fill={isMain ? undefined : 'black'}
      className={clx(s.root, {
        [s.m_not_main]: !isMain,
      })}
    >
      <Link
        href="/"
      >
        <a className={s.logo}>
          <img src="/static/images/logo.svg" alt="GammaCV Logo" />
        </a>
      </Link>

      <div className={s.spacer} />

      <Link href="/docs/get_started">
        <a
          className={clx(
            s.nav_item,
            'text_white',
            'b2',
          )}
        >
          {intl.getText('actions.docs')}
        </a>
      </Link>
      <Link href="/examples">
        <a
          className={clx(
            s.nav_item,
            'text_white',
            'b2',
          )}
        >
          {intl.getText('actions.examples')}
        </a>
      </Link>
      <a
        href="https://github.com/PeculiarVentures/GammaCV"
        target="_blank"
        rel="noopener noreferrer"
        className={clx(
          s.nav_item,
          'text_white',
          'b2',
        )}
      >
        {intl.getText('actions.github')}
      </a>
    </Box>
  );
};

Header.defaultProps = {
  isMain: false,
};

Header.contextTypes = {
  intl: PropTypes.shape({
    getText: PropTypes.func,
  }),
};
