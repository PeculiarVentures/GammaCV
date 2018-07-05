import React from 'react';
import PropTypes from 'prop-types';
import { ContentLoader } from 'lib-react-components';
import s from './styles/content_loader.sass';

const ExampleContentLoader = (props, { device }) => (
  <div className={s.container}>
    <div className={s.content}>
      {
        device.type !== 'mobile'
        ? (
          <ContentLoader width={1200} height={572} color="grey">
            <rect x="0" y="0" rx="3" ry="3" width="170" height="30" />
            <rect x="0" y="72" rx="3" ry="3" width="700" height="460" />
            <rect x="715" y="72" rx="3" ry="3" width="500" height="70" />
            <rect x="715" y="152" rx="3" ry="3" width="500" height="380" />
          </ContentLoader>
        )
        : (
          <ContentLoader width={375} height={600} color="grey">
            <rect x="0" y="0" rx="3" ry="3" width="170" height="30" />
          </ContentLoader>
        )
      }
    </div>
  </div>
);

ExampleContentLoader.contextTypes = {
  device: PropTypes.object,
};

export default ExampleContentLoader;
