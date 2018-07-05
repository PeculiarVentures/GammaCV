const marked = require('marked');
const InlineParser = require('./inline_parse');

module.exports = function parse(markdownText, customBuilders, opts) {
  const data = marked.lexer(markdownText, { gfm: true, tables: true });
  const inlineParser = new InlineParser(data.links, customBuilders, opts);
  const result = [];
  const parents = [result];

  Object.defineProperty(parents, 'last', {
    get() { return this[this.length - 1]; },
  });

  for (const item of data) {
    switch (item.type) {
      case 'list_start': {
        const list = {
          type: 'list',
          ordered: item.ordered,
          items: [],
        };
        parents.last.push(list);
        parents.push(list.items);
        break;
      }

      case 'blockquote_start': {
        const block = {
          type: 'blockquote',
          children: [],
        };
        parents.last.push(block);
        parents.push(block.children);
        break;
      }

      case 'list_item_start':
      case 'loose_item_start': {
        const _item = {
          type: 'list-item',
          children: [],
        };

        parents.last.push(_item);
        parents.push(_item.children);
        break;
      }

      case 'list_item_end':
      case 'blockquote_end':
      case 'list_end':
        if (parents.length > 1) {
          parents.pop();
        }
        break;

      case 'code': {
        parents.last.push({
          type: item.type,
          children: item.text,
          lang: item.lang,
        });
        break;
      }

      case 'heading': {
        const res = inlineParser.parse(item.text);
        parents.last.push({
          type: item.type,
          children: res,
          depth: item.depth,
        });
        break;
      }

      case 'table': {
        parents.last.push({
          type: 'table',
          align: item.align,
          children: [
            {
              type: 'table-header-raw',
              children: item.header.map(_item => ({ type: 'table-head-cell', children: inlineParser.parse(_item) })),
            },
            ...item.cells
              .map(raw => ({
                type: 'table-raw',
                children: raw
                  .map(cell => ({ type: 'table-cell', children: inlineParser.parse(cell) })),
              })),
          ],
        });
        break;
      }

      case 'hr':
        parents.last.push({ type: 'line' });
        break;

      case 'text':
      case 'paragraph':
      default: {
        const res = inlineParser.parse(item.text);
        parents.last.push({
          type: item.type,
          children: res,
        });
        break;
      }
    }
  }

  return result;
};
