const fonts = {
  h1: {
    weight: 700,
    size: '30px',
    height: 1.36,
    spacing: '-0.1px',
  },
  h2: {
    weight: 700,
    size: '25px',
    height: 1.4,
    spacing: 0,
  },
  h3: {
    weight: 700,
    size: '22px',
    height: 1.4,
    spacing: '0.1px',
  },
  h4: {
    weight: 700,
    size: '16px',
    height: 1.6,
    spacing: '0.15px',
  },
  h5: {
    weight: 600,
    size: '15px',
    height: 1.7,
    spacing: '0.25px',
  },
  h6: {
    weight: 600,
    size: '15px',
    height: 1.3,
    spacing: '0.4px',
  },
  b1: {
    weight: 400,
    size: '16px',
    height: 1.8,
    spacing: '0.1px',
  },
  b2: {
    weight: 400,
    size: '15px',
    height: 1.6,
    spacing: '0.35px',
  },
  b3: {
    weight: 400,
    size: '13px',
    height: 1.6,
    spacing: '0.4px',
  },
  c1: {
    weight: 400,
    size: '12px',
    height: 1.4,
    spacing: '0.5px',
  },
};

const palette = {
  primary: '#8F70FA',
  secondary: '#FF6788',
  black: '#0D091A',
  dark_grey: '#373D4D',
  grey: '#CBCFD7',
  light_grey: '#F4F5F9',
  success: '#00D093',
  wrong: '#FF610D',
  white: '#FFFFFF',
};

export default {
  palette,
  variables: {
    fonts,
    borderRadius: '5px',
    button: {
      small: {
        height: '30px',
        fontSize: '13px',
        fontWeight: 600,
      },
      medium: {
        height: '40px',
        fontSize: '14px',
        fontWeight: 600,
      },
      large: {
        height: '50px',
        fontSize: '15px',
        fontWeight: 600,
      },
    },
    input: {
      medium: {
        fontSize: '13px',
        height: '40px',
      },
      large: {
        fontSize: '14px',
        height: '50px',
      },
    },
    checkbox: {
      size: '20px',
      iconSize: '10px',
    },
    radio: {
      size: '20px',
      iconSize: '12px',
    },
    switch: {
      width: '36px',
      height: '22px',
    },
    textareaMediumHeight: '150px',
    textareaLargeHeight: '200px',

    highlightCodeFontSize: '16px',
    highlightCodeColor: '#ccc',
    highlightCodeBorderColor: '#0D091A',
    highlightCodeBackgroundColor: '#0D091A',
    highlightCodeColorComment: '#373D4D',
    highlightCodeColorKeyword: '#c359c5',
    highlightCodeColorPunctuation: '#ccc',
    highlightCodeColorProperty: '#e2777a',
    highlightCodeColorSelector: '#00D093',
    highlightCodeColorOperator: '#67cdcc',
    highlightCodeColorFunction: '#ff8b8e',
    highlightCodeColorVariable: '#e90',
  },
};
