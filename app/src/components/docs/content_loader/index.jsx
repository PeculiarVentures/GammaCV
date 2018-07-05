import React from 'react';
import PropTypes from 'prop-types';
import { ContentLoader } from 'lib-react-components';
import s from './styles/index.sass';

const DocsContentLoader = (props, { device }) => (
  <div className={s.container}>
    <div className={s.content}>
      {
        device.type !== 'mobile'
        ? (
          <ContentLoader width={1200} height={2000} color="grey">
            <rect x="0" y="0" rx="3" ry="3" width="350" height="2000" />
            <rect x="500" y="100" rx="3" ry="3" width="150" height="50" />
            <rect x="500" y="100" rx="3" ry="3" width="150" height="50" />
            <rect x="500" y="220" rx="3" ry="3" width="750" height="150" />
            <rect x="500" y="430" rx="3" ry="3" width="50" height="20" />

            <rect x="500" y="430" rx="3" ry="3" width="50" height="20" />
            <rect x="500" y="485" rx="3" ry="3" width="750" height="30" />
            <rect x="500" y="530" rx="3" ry="3" width="750" height="30" />
            <rect x="500" y="575" rx="3" ry="3" width="750" height="30" />
            <rect x="500" y="620" rx="3" ry="3" width="750" height="30" />

            <rect x="500" y="700" rx="3" ry="3" width="50" height="20" />
            <rect x="500" y="755" rx="3" ry="3" width="750" height="30" />
            <rect x="500" y="800" rx="3" ry="3" width="750" height="30" />
            <rect x="500" y="845" rx="3" ry="3" width="750" height="30" />
            <rect x="500" y="890" rx="3" ry="3" width="750" height="30" />
          </ContentLoader>
        )
        : (
          <ContentLoader width={375} height={800} color="grey">
            <rect x="30" y="110" rx="3" ry="3" width="170" height="30" />
            <rect x="30" y="170" rx="3" ry="3" width="120" height="20" />
            <rect x="30" y="200" rx="3" ry="3" width="315" height="300" />
            <rect x="30" y="200" rx="3" ry="3" width="315" height="300" />
            <rect x="30" y="560" rx="3" ry="3" width="50" height="20" />
          </ContentLoader>
        )
      }
    </div>
  </div>
);

DocsContentLoader.contextTypes = {
  device: PropTypes.object,
};

export default DocsContentLoader;
