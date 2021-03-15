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
        <span className={s.logo}>
          <img src="/static/images/logo.svg" alt="GammaCV Logo" />
        </span>
      </Link>

      <div className={s.spacer} />

      <Link href="/docs/get_started">
        <span
          className={clx(
            s.nav_item,
            'text_white',
            'b2',
          )}
        >
          {intl.getText('actions.docs')}
        </span>
      </Link>
      <Link href="/examples">
        <span
          className={clx(
            s.nav_item,
            'text_white',
            'b2',
          )}
        >
          {intl.getText('actions.examples')}
        </span>
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
