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
  let filteredConfig: IExampleGroup[] = config;

  if (searchValue) {
    filteredConfig = config.map((group) => ({
      ...group,
      examples: group.examples.filter((child) => {
        const name = intl.getText('operations', undefined, child.path);

        return name.toLowerCase().includes(searchValue.toLowerCase());
      }),
    }));
  }

  const renderEmptyCase = () => (
    <Typography type="h5" align="center" className={s.not_found}>
      {intl.getText('actions.nothingFound')}
    </Typography>
  );

  const renderMenu = () => {
    let hasMenuItems = false;

    const menu = filteredConfig.map((group) => {
      if (group.examples.length) {
        hasMenuItems = true;
      } else {
        return null;
      }

      return (
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
      );
    });

    return hasMenuItems ? menu : null;
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

        <div className={s.items_wrapper}>
          {renderMenu() || renderEmptyCase()}
        </div>
      </div>
    </div>
  );
};

ExamplesPage.contextTypes = {
  intl: PropTypes.shape({
    getText: PropTypes.func,
  }),
};
