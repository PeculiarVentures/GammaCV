/**
 * Based on marked - a markdown parser
 * Copyright (c) 2011-2014, Christopher Jeffrey. (MIT Licensed)
 * https://github.com/markedjs/marked
 *
 * Modified by Mihail Zachepilo <mihailzachepilo@gmail.com>
 * Copyright (c) 2018, Mihail Zachepilo. (MIT Licensed)
 */

function replace(_regex, _opt) {
  let regex = _regex.source;
  const opt = _opt || '';

  return function self(name, _val) {
    if (!name) return new RegExp(regex, opt);
    let val = _val.source || _val;
    val = val.replace(/(^|[^[])\^/g, '$1');
    regex = regex.replace(name, val);

    return self;
  };
}

/* eslint-disable */

function escape(html, encode) {
  return html;
  // return html
  //   .replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
  //   .replace(/</g, '&lt;')
  //   .replace(/>/g, '&gt;')
  //   .replace(/"/g, '&quot;')
  //   .replace(/'/g, '&#39;');
}

const inlineRules = {
  escape: /^\\([\\`*{}\[\]()#+\-.!_>])/,
  autolink: /^<([^ >]+(@|:\/)[^ >]+)>/,
  url: /^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,
  tag: /^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/,
  link: /^!?\[(inside)\]\((href)\)+/,
  reflink: /^!?\[(inside)\]\s*\[([^\]]*)\]/,
  nolink: /^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,
  strong: /^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,
  em: /^\b_((?:[^_]|__)+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,
  code: /^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,
  br: /^ {2,}\n(?!\s*$)/,
  del: /^~~(?=\S)([\s\S]*?\S)~~/,
  text: /^[\s\S]+?(?=[@{\\<!\[_*`]| {2,}\n|$)/,
  documentation: /^([\s]+)?{{([A-z./0-9-_]+)}}/,
  people: /^@([\S]+?(?=[{\\<!\[_*`]|\n|$))/,
  issue: /^\\(#([\d]+)(?=[@{\\<!\[_*`]|\n|$))/,
};

function prepareRegexp() {
  inlineRules._inside = /(?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*/;
  inlineRules._href = /\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\)*\s*/;

  inlineRules.link = replace(inlineRules.link)('inside', inlineRules._inside)('href', inlineRules._href)();

  inlineRules.reflink = replace(inlineRules.reflink)('inside', inlineRules._inside)();

  Object.assign(inlineRules, {
    escape: replace(inlineRules.escape)('])', '~|])')(),
    text: replace(inlineRules.text)(']|', '~]|')('|', '|https?://|')(),
  });
}

prepareRegexp();

const structBuilder = {
  link: (href, title, children) => ({
    type: 'link', href, title, children,
  }),
  image: (href, title, alt) => ({
    type: 'image', href, title, alt,
  }),
  strong: children => ({ type: 'strong', children }),
  em: children => ({ type: 'italic', children }),
  codespan: children => ({ type: 'codespan', children }),
  br: () => ({ type: 'br' }),
  del: () => ({ type: 'del' }),
  text: text => text,
  documentation: path => ({ type: 'documentation', path }),
};

class InlineLexer {
  constructor(links, customBuilders = {}, opts = {
    mentions: 'https://github.com/{{arg}}',
    issues: '',
  }) {
    this.links = links;
    this.rules = inlineRules;
    this.opts = opts;

    this.builder = { ...structBuilder };

    Object.keys(customBuilders).forEach((key) => {
      this.builder[key] = (...args) => customBuilders[key](structBuilder[key](...args));
    });
  }

  parse(src) {
    let link = null;
    let text = null;
    let href = null;
    let cap = null;

    const result = [];

    while (src) {
      // issue
      if (this.opts.issues) {
        cap = this.rules.issue.exec(src)
        if (cap) {
          console.log('insert');
          src = src.substring(cap[0].length);
          // result.push(this.builder.text(escape(cap[0])) );
          result.push(this.outputLink(cap[1], {
            href: this.opts.issues.replace(/{{arg}}/, cap[2]),
            title: cap[1],
          }) );
          continue;
        }
      }

      // escape
      cap = this.rules.escape.exec(src)
      if (cap) {
        src = src.substring(cap[0].length);
        result.push(cap[1]);
        continue;
      }

      // autolink
      cap = this.rules.autolink.exec(src)
      if (cap) {
        src = src.substring(cap[0].length);
        if (cap[2] === '@') {
          text = cap[1].charAt(6) === ':'
            ? cap[1].substring(7)
            : cap[1];
          href = `mailto:${text}`;
        } else {
          text = escape(cap[1]);
          href = text;
        }
        result.push(this.builder.link(href, null, text));
        continue;
      }

      // url (gfm)
      if (!this.inLink && (cap = this.rules.url.exec(src))) {
        src = src.substring(cap[0].length);
        text = escape(cap[1]);
        href = text;
        result.push(this.builder.link(href, null, text));
        continue;
      }

      // link
      cap = this.rules.link.exec(src)
      if (cap) {
        src = src.substring(cap[0].length);
        this.inLink = true;
        result.push(this.outputLink(cap, {
          href: cap[2],
          title: cap[2],
        }) );
        this.inLink = false;
        continue;
      }

      // reflink, nolink
      if ((cap = this.rules.reflink.exec(src))
        || (cap = this.rules.nolink.exec(src))) {
        src = src.substring(cap[0].length);
        link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
        link = this.links[link.toLowerCase()];
        if (!link || !link.href) {
          result.push(cap[0].charAt(0));
          src = cap[0].substring(1) + src;
          continue;
        }
        this.inLink = true;
        result.push(this.outputLink(cap, link) );
        this.inLink = false;
        continue;
      }

      // strong
      if (cap = this.rules.strong.exec(src)) {
        src = src.substring(cap[0].length);
        result.push(this.builder.strong(this.parse(cap[2] || cap[1])));
        continue;
      }

      // em
      if (cap = this.rules.em.exec(src)) {
        src = src.substring(cap[0].length);
        result.push(this.builder.em(this.parse(cap[2] || cap[1])) );
        continue;
      }

      // code
      if (cap = this.rules.code.exec(src)) {
        src = src.substring(cap[0].length);
        result.push(this.builder.codespan(escape(cap[2], true)) );
        continue;
      }

      // br
      if (cap = this.rules.br.exec(src)) {
        src = src.substring(cap[0].length);
        result.push(this.builder.br() );
        continue;
      }

      // del (gfm)
      if (cap = this.rules.del.exec(src)) {
        src = src.substring(cap[0].length);
        result.push(this.builder.del(this.parse(cap[1])) );
        continue;
      }

      // documentation
      if (cap = this.rules.documentation.exec(src)) {
        src = src.substring(cap[0].length);
        result.push(this.builder.documentation(cap[2]) );
        continue;
      }

      // people
      if (this.opts.mentions) {
        if (cap = this.rules.people.exec(src)) {
          console.log('insertmm', cap);
          src = src.substring(cap[0].length);
          // result.push(this.builder.text(escape(cap[0])) );
          result.push(this.outputLink(cap[0], {
            href: this.opts.mentions.replace(/{{arg}}/, cap[1]),
            title: cap[0],
          }) );
          continue;
        }
      }

      // text
      if (cap = this.rules.text.exec(src)) {
        src = src.substring(cap[0].length);
        result.push(this.builder.text(escape(cap[0])) );
        continue;
      }

      if (src) {
        throw new Error(`Infinite loop on byte: ${src.charCodeAt(0)}`);
      }
    }

    return result;
  }

  outputLink(cap, link) {
    const href = escape(link.href);
    const title = link.title ? escape(link.title) : null;

    if (typeof cap === 'string') {
      return this.builder.link(href, title, cap);
    }

    return cap[0].charAt(0) !== '!'
      ? this.builder.link(href, title, this.parse(cap[1]))
      : this.builder.image(href, title, escape(cap[1]));
  }
}

module.exports = InlineLexer;
