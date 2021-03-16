import React from 'react';
import { Box, Typography } from 'lib-react-components';
import Link from 'next/link';
import PropTypes from 'prop-types';
import clx from 'classnames';
import { Sidebar } from '../../pages/docs/sidebar';
import config from '../../../sources/docs/config.json'
import s from './index.module.sass';

interface IHeaderProps {
  isMain?: boolean;
}

export const Header = (props: IHeaderProps, context) => {
  const [showSidebar, setShowSidebar] = React.useState(false);
  const { isMain } = props;
  const { intl, device } = context;
  const logo = device.type === 'mobile' ? 'mobile_logo.svg' : 'logo.svg';
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
          <img src={`/static/images/${logo}`} alt="GammaCV Logo" />
        </a>
      </Link>

      <div className={s.spacer} />

      {device.type === 'mobile' ? (
        <Typography
          type="b2"
          color="white"
          className={s.nav_item}
          onClick={() => setShowSidebar(!showSidebar)}
        >
          {intl.getText('actions.docs')}
          <img src={`/static/images/${burgerIcon}`} alt="Menu icon" />
        </Typography>
      ) :
        (
          <Link href="/docs/get_started" >
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
        )}

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

      {device.type === 'mobile' && showSidebar && (
        <Sidebar config={config} isMobile />
      )}
    </Box>
  );
};

Header.contextTypes = {
  intl: PropTypes.object,
  device: PropTypes.object,
};
