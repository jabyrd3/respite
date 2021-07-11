import { execSync } from 'child_process'
export default () => {
  const psout = execSync('ps -eo pid,%mem,command --sort=%mem', { encoding: 'utf8' })
  return psout
}
