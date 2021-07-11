import {execSync} from 'child_process';
export default (pid, trimmedRange) => {
  const vmapOut = execSync(`cat /proc/${pid}/maps | grep ${trimmedRange}`, {encoding: 'utf8'});
  return vmapOut;
};
