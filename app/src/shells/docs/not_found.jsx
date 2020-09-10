import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from 'lib-react-components';
import s from './styles/basic.sass';

const PageNotFoundShell = () => (
  <div className={s.main}>
    <div className={s.valign}>
      <Typography
        className={s.text}
        type="h3"
        align="center"
        color="dark_grey"
      >
        Page not found
      </Typography>
    </div>
  </div>
);

PageNotFoundShell.contextTypes = {
  intl: PropTypes.object,
};

export default PageNotFoundShell;

