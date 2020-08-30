import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from 'lib-react-components';
import s from './styles/basic.sass';

const PageNotFoundShell = (props, { intl }) => (
  <div className={s.main}>
    <div className={s.valign}>
      <Typography
        className={s.text}
        type="h3"
        align="center"
        color="dark_grey"
      >
        {intl.getText('NotFound')}
      </Typography>
    </div>
  </div>
);

PageNotFoundShell.contextTypes = {
  intl: PropTypes.object,
};

export default PageNotFoundShell;
