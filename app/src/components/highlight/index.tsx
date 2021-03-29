import React from 'react';

interface IHighlightProps {
  text: string;
  searchValue: string;
}

export const Highlight: React.FC<IHighlightProps> = (props) => {
  const { text, searchValue } = props;
  const chunks = text.split(new RegExp(`(${searchValue})`, 'gi'));

  return (
    <>
      {chunks.map((chunk, index) => {
        const isEqual = chunk.toLowerCase() === searchValue.toLowerCase();

        return isEqual ? (
          <mark
            key={`${chunk + index}`}
            className="fill_secondary"
          >
            {chunk}
          </mark>
        ) : chunk;
      })}
    </>
  );
};
