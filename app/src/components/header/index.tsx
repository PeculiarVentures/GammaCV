import React from 'react';
import { Box, Typography } from 'lib-react-components';
import Link from 'next/link';
import PropTypes from 'prop-types';
import clx from 'classnames';
import s from './index.module.sass';

interface IHeaderProps {
  isMain?: boolean;
  displaySidebar: (state) => void;
  showSidebar: boolean;
}

export const Header = (props: IHeaderProps, context) => {
  const { isMain, displaySidebar, showSidebar } = props;
  const { intl } = context;
  const burgerIcon = showSidebar ? 'cross_icon.svg' : 'menu_icon.svg';

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
          <img src="/static/images/logo.svg" alt="GammaCV Logo" className={s.logo_img} />
          <img src="/static/images/mobile_logo.svg" alt="GammaCV Logo" className={s.logo_mobile_img} />
        </a>
      </Link>

      <div className={s.spacer} />

      <Link href="/docs/get_started">
        <a
          className={clx(
            s.nav_item,
            s.nav_item_link,
            'text_white',
            'b2',
          )}
        >
          {intl.getText('actions.docs')}
        </a>
      </Link>
      <Typography
        type="b2"
        color="white"
        className={clx(s.nav_item)}
        onClick={() => displaySidebar(!showSidebar)}
      >
        {intl.getText('actions.docs')}
        <img src={`/static/images/${burgerIcon}`} alt="Menu icon" />
      </Typography>
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
