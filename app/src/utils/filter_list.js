const CHARS_TO_ESCAPE = '.^$*+?()[{\\|';

export function prepareRegex(value) {
  const res = [];
  for (let i = 0; i < value.length; i += 1) {
    if (CHARS_TO_ESCAPE.indexOf(value[i]) !== -1) {
      res.push('\\');
    }
    if (typeof value === 'string') {
      res.push(value[i]);
    }
  }

  return new RegExp(res.join(''), 'i');
}

/**
 * @param {Array} list
 * @param {string} query
 * @param {function} getSearchString
 * @return {Array}
 */
export default function filter(list, query, getSearchString) {
  const searchRegEx = query ? prepareRegex(query) : false;
  const test = el => searchRegEx.test(getSearchString(el));

  if (searchRegEx) {
    return list.filter(test);
  }

  return list;
}
