import { execSync } from 'child_process';
import uuid from './uuid';

export default (short) => {
  try {
    const command = short ? 'git rev-parse --short HEAD' : 'git rev-parse HEAD';
    return execSync(command).toString().replace(/\n/, '');
  } catch (error) {
    return uuid();
  }
};
