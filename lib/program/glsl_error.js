const errorStart = 'Error: An error occurred compiling the shaders: ';

function getOffset(line) {
  const l = /\d+\|(\s+)/.exec(line);

  if (l) {
    return ' '.repeat(l[1].length);
  }

  return ' '.repeat(2);
}

export function prepareSourceLines(source) {
  let lines = source.split('\n');
  const targetLength = (lines.length + 1).toString().length;

  lines = lines.map((text, line) => `${(line + 1).toString().padStart(targetLength)}|  ${text}`);

  return lines;
}

function calcErrorStats(errors) {
  let errCount = 0;
  let warnCount = 0;

  for (let i = 0; i < errors.length; i += 1) {
    if (/ERROR/.exec(errors[i])) {
      errCount += 1;
    }
    if (/WARNING/.exec(errors[i])) {
      warnCount += 1;
    }
  }

  return {
    errCount,
    warnCount,
  };
}

function injectAll(kernel, error, useStyles = true) {
  const lines = prepareSourceLines(kernel);
  const targetLength = (lines.length + 1).toString().length;
  let errorText = error.toString();
  const shortErrors = [];
  const fullTextStyle = [];

  if (errorText.startsWith(errorStart)) {
    errorText = errorText.substr(errorStart.length);
  }

  const errors = errorText.split('\n');
  const errorsStats = calcErrorStats(errors);

  let offset = 0;

  for (let i = 0; i < errors.length; i += 1) {
    const text = errors[i];
    const lineNo = /0:(\d+)/.exec(text);

    if (lineNo) {
      const index = +lineNo[1] + offset;
      const preErrorLine = `${' '.repeat(targetLength)}|${getOffset(lines[index - 1])}`;

      shortErrors.push(`${text}\n${lines[index - 2]}\n${lines[index - 1]}\n${preErrorLine}^\n${lines[index]}`);
      const sS = useStyles ? '%c' : '';

      lines.splice(index, 0, `${sS}${preErrorLine}^--${text}${sS}`);
      if (useStyles) {
        fullTextStyle.push('color: red;');
        fullTextStyle.push('color: inherit;');
      }
      offset += 1;
    }
  }

  return {
    fullText: lines.join('\n'),
    firstError: shortErrors[0],
    errorsStats,
    fullTextStyle,
  };
}

export default function processError(kernel, kernelName, error) {
  try {
    const prepared = injectAll(kernel, error);
    const stats = prepared.errorsStats;

    console.group(`Error: An error occurred compiling the shader ${kernelName}: ${stats.errCount} ERRORS, ${stats.warnCount} WARNINGS`);
    console.log(prepared.firstError);
    console.groupCollapsed('Show more');
    console.log(prepared.fullText, ...prepared.fullTextStyle);
    console.groupEnd();
    console.groupEnd();
  } catch (err) {
    console.warn('Unable to process GLSG compiling error.');
  }
}
