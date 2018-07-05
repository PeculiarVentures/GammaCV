import React from 'react';
import PropTypes from 'prop-types';
import { Text, Link, Image, Code, Space, Line, Documentation, List, ListItem, Table, TableRaw, TableCell } from './elements';
import * as TYPES from './types';

/**
 * Parser - parser component
 * @param props
 * @return {ReactElement} markup
 */
const Parser = (props) => {
  const { data } = props;
  const {
    type,
    children,
    items,
    href,
    alt,
    title,
    lang,
    depth,
    file,
  } = data;

  const content = children || items;
  const contentIsString = typeof content === 'string';

  const renderContent = () => {
    if (content) {
      return contentIsString ? (
        content
      ) : (
        content.map((c, key) => {
          if (typeof c === 'string') return c;
          return <Parser data={c} key={key} />; // eslint-disable-line
        })
      );
    }
    return null;
  };

  if (type === TYPES.HEADING) {
    return (
      <Text type={`h${depth}`}>
        {renderContent()}
      </Text>
    );
  }

  if (type === TYPES.PARAGRAPH) {
    return (
      <Text type="b1">
        {renderContent()}
      </Text>
    );
  }

  if (type === TYPES.CODESPAN) {
    return (
      <Text type="code">
        {renderContent()}
      </Text>
    );
  }

  if (type === TYPES.STRONG) {
    return (
      <Text type="strong">
        {renderContent()}
      </Text>
    );
  }

  if (type === TYPES.ITALIC) {
    return (
      <Text type="i">
        {renderContent()}
      </Text>
    );
  }

  if (type === TYPES.BLOCKQUOTE) {
    return (
      <Text type="blockquote">
        {renderContent()}
      </Text>
    );
  }

  if (type === TYPES.LINK) {
    return (
      <Link
        href={href}
        title={title}
      >
        {renderContent()}
      </Link>
    );
  }

  if (type === TYPES.IMAGE) {
    return (
      <Image
        href={href}
        alt={alt}
        title={title}
      >
        {renderContent()}
      </Image>
    );
  }

  if (type === TYPES.CODE) {
    return (
      <Code
        lang={lang}
      >
        {renderContent()}
      </Code>
    );
  }

  if (type === TYPES.LIST) {
    return (
      <List>
        {renderContent()}
      </List>
    );
  }

  if (type === TYPES.LIST_ITEM) {
    return (
      <ListItem>
        {renderContent()}
      </ListItem>
    );
  }

  if (type === TYPES.TEXT) {
    return (
      <Text>
        {renderContent()}
      </Text>
    );
  }

  if (type === TYPES.SPACE) {
    return <Space />;
  }

  if (type === TYPES.LINE) {
    return <Line />;
  }

  if (type === TYPES.TABLE) {
    return (
      <Table align={props.data.align}>
        {renderContent()}
      </Table>
    );
  }

  if (type === TYPES.TABLE_HEAD_RAW || type === TYPES.TABLE_RAW) {
    return (
      <TableRaw>
        {renderContent()}
      </TableRaw>
    );
  }

  if (type === TYPES.TABLE_HEAD_CELL || type === TYPES.TABLE_CELL) {
    return (
      <TableCell head={type === TYPES.TABLE_HEAD_CELL} align={props.data.align}>
        {renderContent()}
      </TableCell>
    );
  }

  if (type === TYPES.DOCUMENTATION) {
    return (
      <div>
        {Object.keys(file).map((f, index) => (
          <Documentation data={file[f]} key={index} /> // eslint-disable-line
        ))}
      </div>
    );
  }

  return (
    <div>NEED PARSE TYPE - {type}</div>
  );
};

/**
 * PropTypes
 * @type {{
 *  data: {
 *    type: string
 *    children: array|string
 *    items: array|string
 *    ordered: boolean
 *    href: string
 *    alt: string
 *    title: string
 *    lang: string
 *    depth: number
 *    file: object
 *  }
 * }}
 */
Parser.propTypes = {
  data: PropTypes.shape({
    type: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.string,
    ]),
    items: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.string,
    ]),
    ordered: PropTypes.bool,
    href: PropTypes.string,
    alt: PropTypes.string,
    title: PropTypes.string,
    lang: PropTypes.string,
    depth: PropTypes.number,
    file: PropTypes.oneOfType([
      PropTypes.object,
    ]),
    align: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.any),
    ]),
  }),
};

Parser.defaultProps = {
  data: {
    type: '',
    children: '',
    align: [],
  },
};

export default Parser;
