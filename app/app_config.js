module.exports = {
  version: 0.2,
  languages: ['en'],
  defaultLanguage: 'en',
  forceHTTPS: false,
  autoReloadOnNewVerison: true,
  shells: [
    'index',
  ],
  endpoints: {
    '*': 'main',
  },
  source: [{
    name: 'bootstrap',
    path: './bootstrap.js',
  }],
  notListenPopstate: true,
  resources: {
    backend: () => import(/* webpackChunkName: "backend" */'./src/backend.js'),
    container: name => import(/* webpackChunkName: "container-[request]" */`./src/containers/${name}/index.jsx`),
    shell: name => import(/* webpackChunkName: "shells-[request]" */`./src/shells/${name}/manifest.js`),
    // lang: () => import(/* webpackChunkName: "lang-[request]" */'./src/assets/langs/en/index'),
    lang: () => {
      const name = 'index';
      return import(/* webpackChunkName: "lang-[request]" */`./src/assets/langs/en/${name}`);
    },
    script: (shell, name) => import(/* webpackChunkName: "shells-[request]" */`./src/shells/${shell}/scripts/${name}`),
  },
};
