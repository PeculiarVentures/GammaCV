import React, { useState } from 'react';
import { TextField, Box, Typography } from 'lib-react-components';
import PropTypes from 'prop-types';
import { SidebarGroup } from './sidebar_group';
import s from './sidebar.module.sass';

interface ISidebarProps {
  config: IDocGroup[];
}

export const Sidebar: React.FC<ISidebarProps> = (props, context) => {
  const { config } = props;
  const { intl } = context;
  const [searchValue, setSearchValue] = useState('');
  let filteredConfig: IDocGroup[] = config;

  if (searchValue) {
    filteredConfig = [];

    config.forEach((group) => {
      const newChildren = group.children.filter(({ name }) => {
        const childName = intl.getText('operations', undefined, name);

        return childName.toLowerCase().includes(searchValue.toLowerCase());
      });

      if (newChildren.length) {
        filteredConfig.push({
          ...group,
          children: newChildren,
        });
      }
    });
  }

  return (
    <Box
      tagType="nav"
      fill="light_grey"
      fillOpacity={0.5}
      stroke="grey"
      strokeType="right"
      strokeOpacity={0.15}
      className={s.root}
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
        {filteredConfig.length ? filteredConfig.map((group) => (
          <SidebarGroup
            key={group.name}
            group={group}
          />
        )) : (
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
              Not Found
            </Typography>
          </div>
        )}
      </ul>
    </Box>
  );
};

Sidebar.contextTypes = {
  intl: PropTypes.shape({
    getText: PropTypes.func,
  }),
};
