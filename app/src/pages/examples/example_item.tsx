import React from 'react';
import { Typography } from 'lib-react-components';
import Link from 'next/link';
import s from './example_item.module.sass';

interface IExampleItemProps {
  name: string;
  type: string;
  path: string;
  style?: React.CSSProperties;
}

export const ExampleItem: React.FC<IExampleItemProps & React.HTMLAttributes<HTMLElement>> = (
  props,
) => {
  const {
    name, type, path, style,
  } = props;

  return (
    <Link
      href={`/examples/${path}`}
    >
      <span
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
          {name}
        </Typography>
      </span>
    </Link>
  );
};
