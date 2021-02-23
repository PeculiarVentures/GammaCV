import React, { Fragment } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import ReactLoadable from 'react-loadable';
import UsagePart from '../../components/docs/usage_part';
import MDRenderer from '../../components/md';
import Sidebar from '../../components/docs/sidebar';
import Footer from '../../components/footer';
import getPath from '../../utils/get_build_path';
import CONFIG from '../../../sources/config.json';
import handleChunkError from '../../utils/chunk_error';
import { getRoute } from '../../utils/doc_item';

import s from './styles/index.sass';

const routeList = CONFIG.docs.reduce((res, group) => res.concat(group.items), []);
const loadable = routeList.map(item => (
  ReactLoadable({
    /* webpackChunkName: "reference-[request]" */
    loader: () => import(`../../../_data/docs/${item.name || item.path.split(/[/.]/).join('_')}.json`)
      .then(module => () => (
        <div className={s.main_wrapper}>
          <div className={s.md_wrapper}>
            {
              /\.jsx?$/.test(item.path)
              ? <UsagePart data={module.default} />
              : <MDRenderer data={module.default} />
            }
          </div>
          <Footer />
        </div>
      ))
      .catch(handleChunkError),
    loading: () => null,
  })
));

const APIReference = (props, { device }) => (
  <Fragment>
    {device.type !== 'mobile' && <Sidebar docsList={CONFIG.docs} />}
    <Switch>
      {
        routeList.map((item, key) => (
          <Route
            exact
            key={item.name || item.path.split(/[/.]/).join('_')}
            path={`${getPath}/docs/${getRoute(item)}`}
            component={loadable[key]}
          />
        ))
      }
      <Redirect from={`${getPath}/docs`} to={`${getPath}/docs/get_started`} />
    </Switch>
  </Fragment>
);

APIReference.contextTypes = {
  device: PropTypes.object,
};

export default APIReference;
