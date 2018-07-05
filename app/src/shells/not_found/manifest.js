export default app => Promise.resolve()
  .then(() => app.mountLang('not_found'))
  .then(() => app.mountTemplate('not_found', 'template'))
  // .then(() => Promise.all([
  //   app.mountTemplate('not_found', 'template'),
  //   app.mountLang('not_found'),
  // ]))
  .then(() => app.localizeTemplate('not_found'));
