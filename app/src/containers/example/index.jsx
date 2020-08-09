import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Typography } from 'lib-react-components';
import ExampleContainer from './example_container';
import handleChunkError from '../../utils/chunk_error';
import s from './styles/index.sass';

export default class Container extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.object, // eslint-disable-line
    }),
  }

  static defaultProps = {
    match: { params: {} },
  }

  constructor(props) {
    super();

    this.state = {
      example: false,
      notFound: false,
      error: null,
    };

    this.pr = import(`../../examples/${props.match.params.id}.js`)
      .then(res => this.setState({ example: res.default }))
      .catch((err) => {
        this.setState({ notFound: true });
        return handleChunkError(err);
      });
  }

  componentDidCatch(error) {
    this.setState({
      error,
    });
  }

  render() {
    const { error, example, notFound } = this.state;

    if (error) {
      return (
        <div className={s.example_wrapper}>
          <div style={{ display: 'inline-block' }}>
            <Typography
              type="b2"
              color="black"
              align="center"
            >
              {error.message}
            </Typography>
          </div>
        </div>
      );
    }

    if (example) {
      return (
        <ExampleContainer
          example={example}
          exampleName={this.props.match.params.id}
        />
      );
    }

    if (notFound) {
      return (
        <div className={s.example_wrapper}>
          <div style={{ display: 'inline-block' }}>
            <Typography
              type="h1"
              color="black"
              align="center"
              style={{ marginBottom: '15px' }}
            >
              404
            </Typography>
            <Typography
              type="h3"
              color="black"
              align="center"
            >
              Page not found
            </Typography>
          </div>
        </div>
      );
    }

    return null;
  }
}
