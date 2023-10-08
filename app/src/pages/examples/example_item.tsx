import React from 'react';
import { Typography } from 'lib-react-components';
import Link from 'next/link';
import { Highlight } from '../../components';
import s from './example_item.module.sass';

interface IExampleItemProps {
  name: string;
  type: string;
  path: string;
  style?: React.CSSProperties;
  searchValue: string;
}

export const ExampleItem: React.FC<IExampleItemProps & React.HTMLAttributes<HTMLElement>> = (
  props,
) => {
  const {
    name, type, path, style, searchValue,
  } = props;

  return (
    <Link
      href={`/examples/${path}`}
      legacyBehavior
    >
      <a
        style={style}
        className={s.root}
      >
        <Typography
          type="c1"
          color="grey"
        >
          {type}
        </Typography>
        <Typography
          type="b2"
          color="dark_grey"
        >
          <Highlight
            text={name}
            searchValue={searchValue}
          />
        </Typography>
      </a>
    </Link>
  );
};
