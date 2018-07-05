import React from 'react';
import PropTypes from 'prop-types';
import { Typography, ThemeProvider } from 'lib-react-components';
import theme from 'lib-react-components/lib/themes/tc.css';
import s from './styles/basic.sass';

const PageNotFoundShell = (props, { intl }) => (
  <ThemeProvider theme={theme}>
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
  </ThemeProvider>
);

PageNotFoundShell.contextTypes = {
  intl: PropTypes.object,
};

export default PageNotFoundShell;
