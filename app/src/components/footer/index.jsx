import React from 'react';
import { Typography } from 'lib-react-components';
import PropTypes from 'prop-types';
import packageJson from '../../../../package.json';
import s from './styles/index.sass';

export default function Footer(props, { intl, device }) {
  if (device.type === 'mobile') {
    return (
      <div className={s.footer_wrapper}>
        <div className={s.api}>
          <Typography
            type="b3"
            color="dark_grey"
          >
            {intl.getText('Footer.Api')}
            {packageJson.version}
          </Typography>
        </div>
        <div className={s.love}>
          <Typography
            type="b3"
            color="grey"
          >
            <span
              dangerouslySetInnerHTML={{
                __html: intl.getText('Footer.Love'),
              }}
            />
          </Typography>
        </div>
        <a
          className={s.get}
          href="mailto:info@peculiarventures.com"
        >
          <Typography
            type="b3"
            color="grey"
          >
            {intl.getText('Footer.Get')}
          </Typography>
        </a>
      </div>
    );
  }
  return (
    <div className={s.footer_wrapper}>
      <div className={s.love}>
        <Typography
          type="b3"
          color="grey"
        >
          <span
            dangerouslySetInnerHTML={{
              __html: intl.getText('Footer.Love'),
            }}
          />
        </Typography>
      </div>
      <div className={s.api}>
        <Typography
          type="b3"
          color="dark_grey"
        >
          {intl.getText('Footer.Api')}
          {packageJson.version}
        </Typography>
      </div>
      <a
        className={s.get}
        href="mailto:info@peculiarventures.com"
      >
        <Typography
          type="b3"
          color="grey"
        >
          {intl.getText('Footer.Get')}
        </Typography>
      </a>
    </div>
  );
}

Footer.contextTypes = {
  intl: PropTypes.object,
  device: PropTypes.object,
};
