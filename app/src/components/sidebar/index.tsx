import React, { useState } from 'react';
import { TextField, Box } from 'lib-react-components';
import PropTypes from 'prop-types';
import clx from 'classnames';
import { SidebarGroup } from './sidebar_group';
import s from './sidebar.module.sass';

interface ISidebarProps {
  config: IDocGroup[];
  hideSidebar?: () => void;
  visible?: boolean;
}

export const Sidebar: React.FC<ISidebarProps> = (props) => {
  const { config, hideSidebar, visible } = props;
  const [searchValue, setSearchValue] = useState('');
  let filteredConfig: IDocGroup[];

  if (searchValue) {
    filteredConfig = config.map((group) => ({
      ...group,
      children: group.children.filter(
        (child) => child.name.toLowerCase().includes(searchValue.toLowerCase()),
      ),
    }));
  }

  return (
    <Box
      tagType="nav"
      fill="light_grey"
      fillOpacity={0.5}
      stroke="grey"
      strokeType="right"
      strokeOpacity={0.15}
      className={clx(s.root, {
        [s.visible]: visible,
      })}
    >
      <div className={s.header}>
        <TextField
          placeholder="Search"
          className={s.search_field}
          onChange={(e) => {
            setSearchValue(e.target.value);
          }}
        />
      </div>
      <ul className={s.list}>
        {(filteredConfig || config).map((group) => (
          <SidebarGroup
            key={group.name}
            group={group}
            hideSidebar={hideSidebar}
          />
        ))}
      </ul>
    </Box>
  );
};

Sidebar.contextTypes = {
  intl: PropTypes.shape({
    getText: PropTypes.func,
  }),
};
