import React, { useState } from 'react';
import { TextField, Box } from 'lib-react-components';
import PropTypes from 'prop-types';
import { SidebarGroup } from './sidebar_group';
import s from './sidebar.module.sass';

interface ISidebarProps {
  config: IDocGroup[];
  hideSidebar?: () => void;
  isMobile?: boolean;
}

export const Sidebar: React.FC<ISidebarProps> = (props) => {
  const { config, hideSidebar, isMobile } = props;
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
      fill={isMobile ? 'black' : 'light_grey'}
      fillOpacity={isMobile ? 1 : 0.5}
      stroke="grey"
      strokeType="right"
      strokeOpacity={0.15}
      className={s.root}
    >
      {!isMobile && (
        <div className={s.header}>
          <TextField
            placeholder="Search"
            className={s.search_field}
            onChange={(e) => {
              setSearchValue(e.target.value);
            }}
          />
        </div>
      )}
      <ul className={s.list}>
        {(filteredConfig || config).map((group) => (
          <SidebarGroup
            key={group.name}
            group={group}
            hideSidebar={hideSidebar}
            isMobile={isMobile}
          />
        ))}
      </ul>
    </Box>
  );
};

Sidebar.defaultProps = {
  isMobile: false,
};

Sidebar.contextTypes = {
  intl: PropTypes.shape({
    getText: PropTypes.func,
  }),
  device: PropTypes.shape({
    type: PropTypes.string,
  }),
};
