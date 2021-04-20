import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Box } from 'lib-react-components';
import s from './index.module.sass';

const facts = [
  {
    name: 'compact',
    icon: '/static/images/compact_icon.svg',
    iconHeight: 39,
  },
  {
    name: 'fast',
    icon: '/static/images/fast_icon.svg',
    iconHeight: 27,
  },
  {
    name: 'cross_platform',
    icon: '/static/images/cross_platform_icon.svg',
    iconHeight: 33,
  },
];

export const MainPage = (props, context) => {
  const { intl } = context;

  return (
    <main className={s.root}>
      <Box
        className={s.preview}
        fill="black"
      >
        <div className={s.m_width}>
          <div className={s.preview_content}>
            <Typography
              type="h1"
              color="light_grey"
              className={s.preview_title}
            >
              {intl.getText('main.preview.title')}
            </Typography>
            <Typography
              type="b1"
              color="light_grey"
            >
              {intl.getText('main.preview.text')}
            </Typography>
          </div>
        </div>
      </Box>
      <div className={s.facts}>
        <div className={s.m_width}>
          <ul className={s.facts_list}>
            {facts.map((fact) => (
              <li
                className={s.facts_item}
                key={fact.name}
              >
                <div className={s.facts_icon_container}>
                  <img
                    src={fact.icon}
                    alt={intl.getText(`main.facts.${fact.name}.title`)}
                    className={s.facts_icon}
                    style={{ height: fact.iconHeight }}
                  />
                </div>
                <Typography
                  type="h4"
                  className={s.facts_title}
                >
                  {intl.getText(`main.facts.${fact.name}.title`)}
                </Typography>
                <Typography
                  type="b2"
                  color="dark_grey"
                >
                  {intl.getText(`main.facts.${fact.name}.text`)}
                </Typography>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
};

MainPage.contextTypes = {
  intl: PropTypes.shape({
    getText: PropTypes.func,
  }),
};
