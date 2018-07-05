import React from 'react';
import PropTypes from 'prop-types';
import { Text, List, ListItem, PadLeft, Line } from './index';

/**
 * Documentation - documentation component
 * @param {object} props
 * @return {ReactElement} markup
 */
const Documentation = (props) => {
  const {
    description,
    kind,
    methods,
    name,
    params,
    // properties,
  } = props.data;

  return (
    <div>
      <br />
      {kind && (
        <Text type="code">
          {kind}
        </Text>
      )}

      {name && (
        <Text type="h2">
          {name}
        </Text>
      )}

      {description && (
        <Text type="p">
          {description}
        </Text>
      )}

      {params.length ? (
        <div>
          <Text type="h3">
            Arguments
          </Text>

          <List>
            {params.map(p => (
              <ListItem>
                <Text type="strong">{p.name} ({p.types.join('|')})</Text>
                {p.description && (
                  <Text> - {p.description}</Text>
                )}
              </ListItem>
            ))}
          </List>
        </div>
      ) : null}

      {methods.length ? (
        <div>
          <Text type="h3">
            Methods
          </Text>

          {methods.map(m => (
            <Text>
              <Text type="code">
                <Text type="strong">
                  {m.name}
                  ({m.params && (
                  m.params.map(p => p.name).join(', ')
                )})
                </Text>
              </Text>
              <br />
              <br />
              <PadLeft>
                {m.description && (
                  <Text type="p">
                    {m.description}
                  </Text>
                )}
                {m.params && (
                  <List>
                    {m.params.map(p => (
                      <ListItem>
                        <Text type="strong">{p.name} ({p.types.join('|')})</Text>
                        {p.description && (
                          <Text> - {p.description}</Text>
                        )}
                      </ListItem>
                    ))}
                  </List>
                )}
              </PadLeft>
            </Text>
          ))}
        </div>
      ) : null}

      <Line />
    </div>
  );
};

/**
 * PropTypes
 * @type {{
 *  data: {
 *    description: string
 *    kind: string
 *    methods: array
 *    name: string
 *    params: array
 *    properties: array
 *  }
 * }}
 */
Documentation.propTypes = {
  data: PropTypes.shape({
    description: PropTypes.string,
    kind: PropTypes.string,
    methods: PropTypes.arrayOf(PropTypes.object),
    name: PropTypes.string,
    params: PropTypes.arrayOf(PropTypes.object),
    properties: PropTypes.arrayOf(PropTypes.object),
  }),
};

Documentation.defaultProps = {
  data: {
    description: '',
    kind: '',
    methods: [],
    name: '',
    params: [],
    properties: [],
  },
};

export default Documentation;
