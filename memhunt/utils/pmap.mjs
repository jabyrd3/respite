import {execSync} from 'child_process';
export default (pid) => {
  const pmapOut = execSync(`pmap ${pid}`, {encoding: 'utf8'});
  return pmapOut;
};
