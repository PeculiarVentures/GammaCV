import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactLoadable from 'react-loadable';
import { Router, Route } from 'react-router-dom';
import { CircularProgress } from 'lib-react-components';
import { IntlWrapper } from 'lib-pintl';
import TurnHandler from '../turn_on_handler';
import DeviceProvider from '../device_provider';
import DocsContentLoader from '../../components/docs/content_loader';
import ExampleContentLoader from '../../components/example/content_loader';
import Header from '../header';
import getPath from '../../utils/get_build_path';
import history from '../../utils/history';
import handleChunkError from '../../utils/chunk_error';
import s from './styles/index.sass';

const Loader = () => (
  <CircularProgress
    size={40}
    colorProgress="primary"
    thickness={2}
    className={s.loader}
  />
);

const Landing = ReactLoadable({
  /* webpackChunkName: "landing" */
  loader: () => import('../../containers/main/index')
    .then(module => module.default)
    .catch(handleChunkError),
  loading: () => <Loader />,
});

const Examples = ReactLoadable({
  /* webpackChunkName: "examples" */
  loader: () => import('../../containers/examples/index')
    .then(module => module.default)
    .catch(handleChunkError),
  loading: () => <Loader />,
});

const Example = ReactLoadable({
  /* webpackChunkName: "examples" */
  loader: () => import('../../containers/example/index')
    .then(module => module.default)
    .catch(handleChunkError),
  loading: () => <ExampleContentLoader />,
});

const Docs = ReactLoadable({
  /* webpackChunkName: "docs" */
  loader: () => import('../../containers/docs/index')
    .then(module => module.default)
    .catch(handleChunkError),
  loading: () => <DocsContentLoader />,
});

class Viewport extends Component { //eslint-disable-line
  static propTypes = {
    lang: PropTypes.oneOfType([
      PropTypes.object,
    ]),
  };

  static defaultProps = {
    lang: {},
  };

  render() {
    return (
      <IntlWrapper
        messages={this.props.lang}
      >
        <DeviceProvider>
          <Router history={history}>
            <div className={s.main_wrapper} style={{ height: '100%' }}>
              <Header />
              <TurnHandler />
              <Route exact path={`${getPath}/`} component={Landing} />
              <Route
                path={`${getPath}/docs`}
                component={() => (
                  <div className={s.content_wrapper}>
                    <Docs />
                  </div>
              )}
              />
              <Route
                exact
                path={`${getPath}/examples`}
                component={() => (
                  <div className={s.content_wrapper}>
                    <Examples />
                  </div>
              )}
              />
              <Route
                exact
                path={`${getPath}/examples/:id`}
                component={prs => (
                  <div className={s.content_wrapper}>
                    <Example {...prs} />
                  </div>
              )}
              />
            </div>
          </Router>
        </DeviceProvider>
      </IntlWrapper>
    );
  }
}

export default Viewport;
