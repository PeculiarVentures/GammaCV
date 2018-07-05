export default function selectLanguage(available, preferable) {
  for (let lang of preferable) {
    lang = lang.split('-')[0].toLowerCase();
    if (available.indexOf(lang) >= 0) {
      return lang;
    }
  }

  return '';
}
