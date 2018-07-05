import { CUSTOM_ACTION } from '../../constants/actions';

export default (app, props) => { // eslint-disable-line
  return Promise.resolve()
    .then(() => app.mountLang('example'))
    .then(() => app.mountContainer('example', { type: CUSTOM_ACTION }))
    .catch((err) => {
      if (err === 'Bad Request' || err === 'Not Found') {
        return app.mountTemplate('example', 'not_found');
      }

      return Promise.reject(err);
    });
};
