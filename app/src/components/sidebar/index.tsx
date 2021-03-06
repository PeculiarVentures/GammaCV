import React, { useState } from 'react';
import { TextField, Box, Typography } from 'lib-react-components';
import PropTypes from 'prop-types';
import { SidebarGroup } from './sidebar_group';
import { useMediaQuery } from '../../utils/use_media_query';
import s from './sidebar.module.sass';

interface ISidebarProps {
  config: IDocGroup[];
  visible: boolean;
}

export const Sidebar: React.FC<ISidebarProps> = (props, context) => {
  const { config, visible } = props;
  const { intl } = context;
  const [searchValue, setSearchValue] = useState('');
  const match = useMediaQuery('(max-width: 1024px)');
  let filteredConfig: IDocGroup[] = config;

  if (searchValue) {
    filteredConfig = config.map((group) => ({
      ...group,
      children: group.children.filter((child) => {
        const name = intl.getText('operations', undefined, child.name);

        return name.toLowerCase().includes(searchValue.toLowerCase());
      }),
    }));
  }

  const renderEmptyCase = () => (
    <div className={s.not_found_wrapper}>
      <Typography
        type="b3"
        color="grey"
        align="center"
        className={s.not_found_text}
      >
        {searchValue}
      </Typography>
      <Typography
        type="b3"
        color="grey"
        align="center"
        className={s.not_found_text}
      >
        {intl.getText('actions.notFound')}
      </Typography>
    </div>
  );

  const renderMenu = () => {
    let hasMenuItems = false;

    const menu = filteredConfig.map((group) => {
      if (group.children.length) {
        hasMenuItems = true;
      } else {
        return null;
      }

      return (
        <SidebarGroup
          key={group.name}
          group={group}
          searchValue={searchValue}
        />
      );
    });

    return hasMenuItems ? menu : null;
  };

  return (
    <Box
      tagType="nav"
      fill={match ? 'black' : 'light_grey'}
      fillOpacity={match ? 1 : 0.5}
      stroke={match ? undefined : 'grey'}
      strokeType="right"
      strokeOpacity={0.15}
      className={s.root}
      style={{
        visibility: visible ? 'visible' : 'hidden',
      }}
    >
      <div className={s.header}>
        <TextField
          placeholder={intl.getText('actions.search')}
          className={s.search_field}
          onChange={(e) => {
            setSearchValue(e.target.value);
          }}
        />
      </div>
      <ul className={s.list}>
        {renderMenu() || renderEmptyCase()}
      </ul>
    </Box>
  );
};

Sidebar.contextTypes = {
  intl: PropTypes.shape({
    getText: PropTypes.func,
  }),
};
