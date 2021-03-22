import React from 'react';
import { Typography } from 'lib-react-components';
import s from './group_item.module.sass';

interface IGroupItemProps {
  name: string;
  children: React.ReactNode;
}

export const GroupItem: React.FC<IGroupItemProps> = (props) => {
  const { name, children } = props;

  return (
    <div className={s.root}>
      <Typography
        type="c1"
        color="grey"
        className={s.group_name}
      >
        {name.toUpperCase()}
      </Typography>
      <div className={s.list}>
        {children}
      </div>
    </div>
  );
};
