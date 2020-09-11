import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Typography } from 'lib-react-components';
import { Link } from 'react-router-dom';
import getPath from '../../../../utils/get_build_path';
import MarkDownRender from '../../../md';
import s from './styles/index.sass';

import nameSpace from '../../../../../_data/docs/namespace.json';

const capitalizeFirstLetter = string => string[0].toUpperCase() + string.slice(1);

const TypeInner = (type) => {
  const content = capitalizeFirstLetter(type) || '';

  if (nameSpace[type]) {
    let url;

    if (/^https?:\/\//.test(nameSpace[type])) {
      url = nameSpace[type];
    } else {
      url = `${getPath}/docs/${nameSpace[type]}`;
    }

    return (
      <Link
        onClick={e => e.stopPropagation()}
        className={classNames('text_primary', s.link)}
        to={url}
      >
        {content}
      </Link>
    );
  }

  return content;
};

const Types = (props) => {
  const type = props.data;
  let typeValue;

  if (Array.isArray(type)) {
    typeValue = [];
    const _typeValue = type.map((el, key) => {
      if (props.onlyText) {
        return TypeInner(el.type);
      }

      return (
        <Typography
          className={s.type}
          type={props.type || 'b2'}
          color={props.color || (props.deviceType !== 'mobile' ? 'dark_grey' : 'grey')}
          key={key} //eslint-disable-line
        >
          {
            TypeInner(el.type)
          }
          {
            el.applications ? (
              <span className={s.applications}>
                .
                <span>{'<'}</span>
                <Types
                  type={props.type}
                  color={props.color}
                  data={el.applications}
                  onlyText
                />
                <span>{'>'}</span>
              </span>
            ) : null
          }
        </Typography>
      );
    });

    for (let i = 0; i < _typeValue.length; i += 1) {
      if (i > 0) {
        typeValue.push(<span key={`|_${i}`}> | </span>);
      }

      typeValue.push(_typeValue[i]);
    }
  } else {
    return null;
  }

  return (
    <Fragment>
      { typeValue }
    </Fragment>
  );
};

Types.propTypes = {
  deviceType: PropTypes.string,
  type: PropTypes.string,
  color: PropTypes.string,
  data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  onlyText: PropTypes.bool,
};

Types.defaultProps = {
  deviceType: '',
  data: {},
  type: '',
  color: '',
  onlyText: false,
};

const PropsList = (props, { intl, device }) => {
  const { data, title, removeTitle } = props;

  return (
    <table className={s.table}>
      {
        removeTitle ? null : (
          <thead>
            <tr>
              <th>
                <Typography
                  color="grey"
                  type=""
                >
                  { title || intl.getText('Operations.Params')}
                </Typography>
              </th>
            </tr>
          </thead>
        )
      }
      <tbody>
        {data.map((item, index) => {
          const {
            name,
            description,
            type,
            optional,
          } = item;
          const typeValue = <Types deviceType={device.type} data={type} />;

          return (
            <tr
              key={index} // eslint-disable-line
            >
              <td>
                <Typography
                  color="dark_grey"
                  type="h6"
                >
                  {name || ''}{optional ? '?' : ''}
                  {
                    item.rest ? ', ...' : ''
                  }
                </Typography>
                {device.type === 'mobile' && typeValue}
              </td>
              <td
                style={{
                  display: device.type === 'mobile' ? 'none' : null,
                }}
              >
                {typeValue || ''}
              </td>
              <td>
                <MarkDownRender data={description} />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

PropsList.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string,
  removeTitle: PropTypes.bool,
};

PropsList.defaultProps = {
  data: {},
  title: '',
  removeTitle: false,
};

PropsList.contextTypes = {
  intl: PropTypes.object,
  device: PropTypes.object,
};

export const ArgType = Types;
export default PropsList;
