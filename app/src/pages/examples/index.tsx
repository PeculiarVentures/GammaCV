import React, { useState } from 'react';
import { Typography, TextField, Box } from 'lib-react-components';
import PropTypes from 'prop-types';
import { GroupItem } from './group_item';
import { ExampleItem } from './example_item';
import s from './index.module.sass';

interface IExamplesPageProps {
  config: IExampleGroup[];
}

export const ExamplesPage: React.FC<IExamplesPageProps> = (props, context) => {
  const { config } = props;
  const { intl } = context;
  const [searchValue, setSearchValue] = useState('');

  const getExampleItemStyles = (index: number) => ({ animationDelay: `${index / 20}s` });

  let filteredConfig: IExampleGroup[];

  if (searchValue) {
    filteredConfig = config.map((group) => ({
      ...group,
      examples: group.examples.filter(
        (example) => example.name.toLowerCase().includes(searchValue.toLowerCase()),
      ),
    }));
  }

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
            {intl.getText('actions.examples')}
          </Typography>
          <TextField
            placeholder={intl.getText('actions.search')}
            className={s.search_field}
            onChange={(e) => {
              setSearchValue(e.target.value);
            }}
          />
        </Box>

        {(filteredConfig || config).map((group) => (
          <GroupItem
            key={group.key}
            name={intl.getText(`groups.${group.key}`)}
          >
            {group.examples.map((example, index) => (
              <ExampleItem
                key={example.path}
                name={intl.getText(`operations.${example.path}`)}
                type={intl.getText(`type.${example.type}`)}
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

ExamplesPage.contextTypes = {
  intl: PropTypes.shape({
    getText: PropTypes.func,
  }),
};
