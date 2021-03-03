import React from 'react';
import { Typography, TextField, Box } from 'lib-react-components';
import { GroupItem } from './group_item';
import { ExampleItem } from './example_item';
import s from './index.module.sass';

interface IExamplesPageProps {
  config: IExampleGroup[];
}

export const ExamplesPage: React.FC<IExamplesPageProps> = (props) => {
  const { config } = props;

  const getExampleItemStyles = (index: number) => {
    return { animationDelay: `${index / 20}s` };
  };

  return (
    <div className={s.root}>
      <div className={s.m_width}>
        <Box
          className={s.header}
          stroke="grey"
          strokeOpacity={0.15}
          strokeType="bottom"
        >
          <Typography
            type="h3"
          >
            Examples
          </Typography>
          <TextField
            placeholder="Search"
            className={s.search_field}
          />
        </Box>

        {config.map((group) => (
          <GroupItem
            key={group.key}
            name={group.name}
          >
            {group.examples.map((example, index) => (
              <ExampleItem
                key={example.path}
                name={example.name}
                type={example.type}
                path={example.path}
                style={getExampleItemStyles(index)}
              />
            ))}
          </GroupItem>
        ))}
      </div>
    </div>
  );
};
