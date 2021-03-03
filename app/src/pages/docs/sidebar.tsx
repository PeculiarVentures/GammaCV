import React from 'react';
import { TextField, Box } from 'lib-react-components';
import { SidebarGroup } from './sidebar_group';
import s from './sidebar.module.sass';

interface ISidebarProps {
  config: IDocGroup[];
}

export const Sidebar: React.FC<ISidebarProps> = (props) => {
  const { config } = props;

  return (
    <Box
      tagType="aside"
      fill="light_grey"
      fillOpacity={0.5}
      stroke="grey"
      strokeType="right"
      strokeOpacity={0.15}
      className={s.root}
    >
      <div className={s.header}>
        <TextField
          placeholder="Search"
          className={s.search_field}
        />
      </div>
      <ul className={s.list}>
        {config.map((group) => (
          <SidebarGroup
            key={group.name}
            group={group}
          />
        ))}
      </ul>
    </Box>
  );
};
