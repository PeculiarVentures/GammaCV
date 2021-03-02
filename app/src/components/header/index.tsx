import { Box } from 'lib-react-components';
import Link from 'next/link';
import PropTypes from 'prop-types';
import clx from 'classnames';
import s from './index.module.sass';

interface IHeaderProps {
  transparent?: boolean;
}

export const Header = (props: IHeaderProps, context) => {
  const { transparent } = props;
  const { intl } = context;

  return (
    <Box
      tagType="header"
      fill={transparent ? undefined : 'black'}
      className={s.root}
    >
      <Link
        exact
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

Header.contextTypes = {
  intl: PropTypes.object,
};
