import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Box } from 'lib-react-components';
import s from './index.module.sass';

const facts = [
  {
    title: 'Compact',
    description: 'Weighing in at only 87.5k uncompressed and 32.5k compressed GammaCV is small enough to be used in your Progressive Web Application without weighing it down.',
    icon: '/static/images/compact_icon.svg',
    iconHeight: 39,
  },
  {
    title: 'Fast',
    description: 'Many computer vision libraries make the typical laptop sound like it is about to take off like a jet plane. Not GammaCV, our use of WebGL enables fast frame rates without consuming all of the users CPU resources.',
    icon: '/static/images/fast_icon.svg',
    iconHeight: 27,
  },
  {
    title: 'Cross Platform',
    description: 'We did the work so you don\'t have to. All of the capabilities offered by GammaCV have been tested to work reliably in all modern browsers on desktop, mobiles and tablets.',
    icon: '/static/images/cross_platform_icon.svg',
    iconHeight: 33,
  },
];

export const MainPage = () => {
  return (
    <>
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
              GammaCV is a WebGL accelerated Computer Vision library for modern web applications.
            </Typography>
            <Typography
              type="b1"
              color="light_grey"
            >
              We created GammaCV to make it easy to integrate Computer Vision in modern web applications. GammaCV was built with a similar architecture to TensorFlow, in particular, it also uses a data flow paradigm to create and run graphs on GPU, this enables the robust image processing and feature extraction capability of the library.
            </Typography>
          </div>
        </div>
      </Box>
      <div className={s.facts}>
        <div className={s.m_width}>
          <ul className={s.facts_list}>
            {facts.map((fact, index) => (
              <li
                className={s.facts_item}
                key={index}
              >
                <div className={s.facts_icon_container}>
                  <img
                    src={fact.icon}
                    alt={fact.title}
                    className={s.facts_icon}
                    style={{ height: fact.iconHeight }}
                  />
                </div>
                <Typography
                  type="h4"
                  className={s.facts_title}
                >
                  {fact.title}
                </Typography>
                <Typography
                  type="b2"
                  color="dark_grey"
                >
                  {fact.description}
                </Typography>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

MainPage.contextTypes = {
  intl: PropTypes.object,
  device: PropTypes.object,
};
