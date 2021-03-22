import React from 'react';
import { Typography } from 'lib-react-components';
import PropTypes from 'prop-types';
import Link from 'next/link';
import clx from 'classnames';
import s from './sidebar_group.module.sass';

interface ISidebarGroupProps {
  group: IDocGroup;
}

export const SidebarGroup: React.FC<ISidebarGroupProps> = (props, context) => {
  const { group } = props;
  const { intl } = context;

  return (
    <li className={s.root}>
      <Typography
        type="c1"
        color="grey"
        className={s.group_name}
      >
        {intl.getText('groups', undefined, group.name)}
      </Typography>
      <ul className={s.list}>
        {group.children.map((doc) => (
          <li
            key={doc.name}
          >
            <Link
              href={`/docs/${doc.name}`}
            >
              <a
                className={clx(
                  s.link,
                  'text_black',
                  'b2',
                )}
              >
                {intl.getText('operations', undefined, doc.name)}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );
};

SidebarGroup.contextTypes = {
  intl: PropTypes.shape({
    getText: PropTypes.func,
  }),
};
