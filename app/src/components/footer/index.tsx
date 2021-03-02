import { Box, Typography } from 'lib-react-components';
import PropTypes from 'prop-types';
import clx from 'classnames';
import s from './index.module.sass';

export const Footer = (props, context) => {
  const { intl } = context;

  return (
    <Box
      stroke="grey"
      strokeOpacity={0.15}
      strokeType="top"
      className={s.root}
    >
      <Typography
        type="b3"
        color="grey"
      >
        {intl.getText('footer.title')}
      </Typography>

      <div className={s.spacer} />

      <Typography
        type="b3"
        color="dark_grey"
      >
        {intl.getText('footer.version')}: {process.env.LIB_VERSION}
      </Typography>
      <a
        href="mailto:info@peculiarventures.com"
        target="_blank"
        rel="noopener noreferrer"
        className={clx(
          s.nav_item,
          'text_grey',
          'b3',
        )}
      >
        {intl.getText('actions.getInTouch')}
      </a>
    </Box>
  );
};

Footer.contextTypes = {
  intl: PropTypes.object,
};
