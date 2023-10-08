import React from 'react';
import { Box, Typography, Button } from 'lib-react-components';
import Link from 'next/link';
import PropTypes from 'prop-types';
import clx from 'classnames';
import { useMediaQuery } from '../../utils/use_media_query';
import s from './index.module.sass';

interface IHeaderProps {
  isMain?: boolean;
  displaySidebar: (state) => void;
  showSidebar: boolean;
}

export const Header: React.FC<IHeaderProps> = (props: IHeaderProps, context) => {
  const { isMain, displaySidebar, showSidebar } = props;
  const { intl } = context;
  const match = useMediaQuery('(max-width: 1024px)');
  const burgerIcon = showSidebar ? 'cross_icon.svg' : 'menu_icon.svg';

  const renderDocsLink = () => (
    <Link href="/docs/get_started" legacyBehavior>
      <a
        className={clx(
          s.nav_item,
          s.docs_link,
          'text_white',
          'b2',
        )}
      >
        {intl.getText('actions.docs')}
      </a>
    </Link>
  );

  const renderDisplayDocsButton = () => (
    <Button
      onClick={() => displaySidebar(!showSidebar)}
      bgType="clear"
      className={clx(s.nav_item, s.display_docs)}
    >
      <Typography
        type="b2"
        color="white"
      >
        {intl.getText('actions.docs')}
        <img src={`/static/images/${burgerIcon}`} alt="Menu icon" />
      </Typography>
    </Button>
  );

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
        legacyBehavior
      >
        <a className={s.logo}>
          {match
            ? <img src="/static/images/mobile_logo.svg" alt="GammaCV Logo" className={s.logo_mobile_img} />
            : <img src="/static/images/logo.svg" alt="GammaCV Logo" className={s.logo_img} />}
        </a>
      </Link>

      <div className={s.spacer} />

      {match ? renderDisplayDocsButton() : renderDocsLink()}

      <Link href="/examples" legacyBehavior>
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
