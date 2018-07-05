export const getRoute = (item) => {
  if (item.route) {
    return item.route;
  }

  if (item.name) {
    return item.name.toLowerCase().split(' ').join('_');
  }

  const parsed = /(\w+)\/?((?=index.js)|\.js$)/.exec(item.path);

  if (parsed && parsed[1]) {
    return parsed[1];
  }

  return item.path.split(/[./]/).filter(a => a).join('_');
};
