import React from 'react';
import { Typography } from 'lib-react-components';
import Link from 'next/link';
import clx from 'classnames';
import s from './sidebar_group.module.sass';

interface ISidebarGroupProps {
  group: IDocGroup;
  hideSidebar: () => void;
}

export const SidebarGroup: React.FC<ISidebarGroupProps> = (props) => {
  const { group, hideSidebar } = props;

  return (
    <li className={s.root}>
      <Typography
        type="c1"
        color="grey"
        className={s.group_name}
      >
        {group.name}
      </Typography>
      <ul className={s.list}>
        {group.children.map((doc) => (
          <li
            key={doc.name}
          >
            <Link
              href={`/docs/${doc.name}`}
            >
              <a>
                <Typography
                  type="b2"
                  onClick={hideSidebar}
                  className={clx(
                    s.link,
                    'text_black',
                  )}
                >
                  {doc.name}
                </Typography>
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );
};
