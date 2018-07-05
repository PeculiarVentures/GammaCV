import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Typography, HighlightCode } from 'lib-react-components';
import HashLink from '../../hash_link';
import PropsList, { ArgType } from './props_list';
import MarkDownRender from '../../md';
import packageJSON from '../../../../../package.json';
import s from './styles/index.sass';

const capitalizeFirstLetter = string => string[0].toUpperCase() + string.slice(1);

const renderExamples = (data, ignoreTitle) => (
  ((data && data.examples) || []).map((el, key) => (
    <div
      className={s.example_item}
      key={key} //eslint-disable-line
    >
      {
        ignoreTitle ? null : (
          <Typography
            className={s.descr_title}
            color="grey"
            type=""
          >
            {el.title.toUpperCase()}
          </Typography>
        )
      }
      <HighlightCode
        lang="js"
      >
        {el.description}
      </HighlightCode>
    </div>
  ))
);

const NoData = (intl, theme) => (
  <div className={s.section_wrapper}>
    <Typography
      className={s.title}
      color="black"
      type="h2"
    >
      { intl.getText('Operations.ContributionTitle') }
    </Typography>
    <div className={s.description}>
      <Typography
        className={s.descr_title}
        color="grey"
        type=""
      >
        { intl.getText('Operations.Visit') }
        {' '}
        <a
          href={packageJSON.repository.url}
          className={theme.text_primary}
        >
          GitHub
        </a>
      </Typography>
    </div>
  </div>
);

const parseDescription = str => (
  <MarkDownRender data={str} />
);

const TypeLabel = (usedData, inner) => (
  usedData.type && usedData.type !== 'method' ? (
    <Typography
      color="grey"
      type={inner ? 'h4' : 'h2'}
      mobileType="b1"
      className={s.label}
    >
      { capitalizeFirstLetter(usedData.type.toLowerCase()) }
    </Typography>
  ) : null
);

const Description = (usedData, inner, intl) => (
  usedData.description
    ? (
      <div className={s.description}>
        {
          !inner ? (
            <Typography
              className={s.descr_title}
              color="grey"
              type=""
            >
              {intl.getText('Operations.DescrTitle') || ''}
            </Typography>
          ) : null
        }
        { parseDescription(usedData.description) }
      </div>
    ) : null
);

const Examples = (usedData, inner) => (
  usedData.examples && usedData.examples.length ? (
    <div key="examples" className={s.examples}>
      {renderExamples(usedData, inner)}
    </div>
  ) : null
);

const Params = (usedData, inner) => (
  Array.isArray(usedData.params) && usedData.params.length ? (
    <div key="params" className={s.props}>
      <PropsList
        removeTitle={inner}
        data={usedData.params}
      />
    </div>
  ) : null
);

const UsagePart = (props, { intl, theme }) => {
  const usedData = props.data;
  const inner = props.inner;

  if (!usedData) {
    return NoData(intl, theme);
  }

  return (
    <div
      className={classNames(s.section_wrapper, { [s.inner]: inner })}
      id={encodeURIComponent(usedData.name)}
    >
      <div className={s.title_block}>
        <HashLink smooth to={`#${encodeURIComponent(usedData.name)}`}>
          {
            usedData.static ? (
              <Typography
                color="grey"
                type={props.inner ? 'h4' : 'h2'}
                mobileType="b1"
                className={s.label}
              >
                Static
              </Typography>
            ) : null
          }
          {
            TypeLabel(usedData, inner)
          }
          <Typography
            className={s.title}
            color="black"
            type={props.inner ? 'h4' : 'h2'}
            mobileType={props.inner ? 'h4' : 'h3'}
          >
            <span className={s.title_text}>
              {usedData.name || 'NONAME'}
            </span>
            {
              inner && usedData.params ? (
                <span className={s.title_text}>
                ({
                  usedData.params
                    .map(param => `${param.name}${param.optional ? '?' : ''}${param.rest ? ', ...' : ''}`)
                    .join(', ')
                })
                </span>
              ) : null
            }
          </Typography>
          {
            usedData.return ? (
              <Typography
                className={s.in_place_params}
                color="grey"
                type={props.inner ? 'h4' : 'h2'}
                mobileType={props.inner ? 'h4' : 'h3'}
              >
                {'=>'} <ArgType
                  type={props.inner ? 'h4' : 'h2'}
                  color="grey"
                  data={(usedData.returns || usedData.return).type}
                />
                &nbsp;{
                  (usedData.returns || usedData.return).description
                    ? (`(${(usedData.returns || usedData.return).description})`) : null
                }
              </Typography>
            ) : null
          }
        </HashLink>
      </div>
      {
        Description(usedData, inner, intl)
      }
      {
        inner
          ? [Params(usedData, inner), Examples(usedData, inner)]
          : [Examples(usedData, inner), Params(usedData, inner)]
      }
      {
        Array.isArray(usedData.methods) ? (
          <div className={s.methods}>
            <Typography
              className={s.descr_title}
              color="grey"
              type=""
            >
              METHODS
            </Typography>
            {
              usedData.methods.map(method => (
                <UsagePart inner data={method} key={method.name} />
              ))
            }
          </div>
        ) : null
      }
    </div>
  );
};

UsagePart.propTypes = {
  data: PropTypes.object, // eslint-disable-line
  // data: PropTypes.arrayOf(PropTypes.object),
  inner: PropTypes.bool,
};

UsagePart.defaultProps = {
  data: {},
  inner: false,
};

UsagePart.contextTypes = {
  intl: PropTypes.object,
  theme: PropTypes.object,
};

const JSDocs = ({ data }) => (
  // <div className={s.content_wrapper}>
  //   {
  data
    .filter(d => d.name || d.class)
    .map(d => <UsagePart key={`${d.name || d.class}`} data={d} />)
  //   }
  // </div>
);

JSDocs.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
};

JSDocs.defaultProps = {
  data: [],
};

export default JSDocs;
