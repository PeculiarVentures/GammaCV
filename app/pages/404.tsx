import React from 'react';
import { Typography } from 'lib-react-components';
import PropTypes from 'prop-types';
import type { IntlContext } from 'lib-pintl';
import s from './404.module.sass';

const NotFound = (_: unknown, context: { intl: IntlContext }) => {
  const { intl } = context;

  return (
    <div className={s.root}>
      <Typography
        type="h1"
        align="center"
        className={s.title}
      >
        404
      </Typography>
      <Typography
        type="h3"
        align="center"
      >
        {intl.getText('404.title')}
      </Typography>
    </div>
  );
};

NotFound.contextTypes = {
  intl: PropTypes.shape({
    getText: PropTypes.func,
  }),
};

export default NotFound;
