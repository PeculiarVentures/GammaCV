import React from 'react';
import { Typography } from 'lib-react-components';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Footer from '../../components/footer';
import { FastIcon, CrossPlatformIcon, CompactIcon } from '../../assets/svg/landing';
import s from './styles/index.sass';

const ADVANTAGES = ['compact', 'fast', 'cross_platform'];

const MainPage = (props, { theme, intl }) => {
  function renderIcon(adv) {
    if (adv === 'compact') {
      return <CompactIcon className={s.compact_icon} />;
    }
    if (adv === 'fast') {
      return <FastIcon className={s.fast_icon} />;
    }
    if (adv === 'cross_platform') {
      return <CrossPlatformIcon className={s.cross_icon} />;
    }

    return null;
  }

  return (
    <div className={s.main_page_wrapper}>
      <div className={s.cont}>
        <div
          key="main"
          className={classNames(
          s.wrapper,
          theme.fill_black,
        )}
        >
          <div
            className={classNames(
              s.css_gradients,
              s.orangetopink,
            )}
          />
          <div
            className={classNames(
              s.css_gradients,
              s.tealtopink,
            )}
          />
          <div className={s.main_container}>
            <div className={s.content}>
              <Typography
                className={s.title}
                color="light_grey"
                type="h1"
              >
                {intl.getText('Main.Title')}
              </Typography>
              <Typography
                color="light_grey"
                type="b1"
              >
                <span
                  dangerouslySetInnerHTML={{
                  __html: intl.getText('Main.Description'),
                }}
                />
              </Typography>
            </div>
          </div>
        </div>
        <div key="advantages" className={s.advantages}>
          {
          ADVANTAGES.map((el, index) => (
            <div
              key={index} //eslint-disable-line
              className={s.adv_item}
            >
              <div className={s.icon_container}>
                {
                  renderIcon(el)
                }
              </div>
              <Typography
                style={{
                  marginBottom: '22px',
                }}
                color="black"
                type="h4"
              >
                {intl.getText('Main.Advantages.Titles', null, el)}
              </Typography>
              <Typography
                color="dark_grey"
                type="b2"
              >
                {intl.getText('Main.Advantages.Descriptions', null, el)}
              </Typography>
            </div>
          ))
        }
        </div>
      </div>
      <Footer />
    </div>
  );
};

MainPage.contextTypes = {
  intl: PropTypes.object,
  theme: PropTypes.object,
};

export default MainPage;
