import React from 'react';
import { Typography, TypographyBasicProps } from 'lib-react-components';

interface IHighlightProps {
  text: string;
  searchValue: string;
}

export const Highlight: React.FC<IHighlightProps & TypographyBasicProps> = (props) => {
  const { text, searchValue, ...typographyProps } = props;
  const chunks = text.split(new RegExp(`(${searchValue})`, 'gi'));

  return (
    <Typography
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...typographyProps}
    >
      {chunks.map((chunk, index) => (chunk.toLowerCase() === searchValue.toLowerCase()
        ? <mark key={`${chunk + index}`} className="fill_secondary">{chunk}</mark>
        : chunk))}
    </Typography>
  );
};
