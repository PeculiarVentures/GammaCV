import React from 'react';
import PropTypes from 'prop-types';
import s from './styles/basic.sass';

const PageNotFoundShell = (props, { intl }) => (
  <div className={s.page_not_found_bg}>
    { intl.getText('NotFound') }
  </div>
);

PageNotFoundShell.contextTypes = {
  intl: PropTypes.object,
};

export default PageNotFoundShell;
