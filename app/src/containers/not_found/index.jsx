import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from 'lib-react-components';
import s from './styles/index.sass';

const NotFound = (_, { intl }) => ((
  <div className={s.main}>
    <div className={s.valign}>
      <Typography
        type="h1"
        color="black"
        align="center"
        style={{ marginBottom: '15px' }}
      >
        404
      </Typography>
      <Typography
        type="h3"
        color="black"
        align="center"
      >
        {intl.getText('NotFound')}
      </Typography>
    </div>
  </div>
));

NotFound.contextTypes = {
  intl: PropTypes.object,
};

export default NotFound;
