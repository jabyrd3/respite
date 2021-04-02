import child from 'child_process';
import fs from 'fs';
import {readdir, readFile, writeFile, readdirSync} from 'fs';
import {promisify} from 'util';
import parseConfig from './parseConf.mjs';
// promisify to make em await-able
const ls = promisify(readdir);
const read = promisify(readFile);
const write = promisify(writeFile);

// const testing = () => {
//   console.log(getDirectories('/etc/puk/services'))
// }
class Renderer {
  constructor(configuration){
    Promise.all(this.getDirectories('/etc/puk/services').map(async service => {
      const rc = await read(`/etc/puk/services/${service}/proc.conf`, 'utf8');
      const config = parseConfig(rc);
      return {
        service,
        config
      };
    }))
    .then(this.flow).then(()=>{console.log('alldone')}).catch(console.error);
    // console.log('jabby', this.services);
  }
  evalDoc = (path, vals) => {
    const raw = fs.readFileSync(path, 'utf8');
    console.log('raw', raw);
    return eval('`' + raw + '`');
  };
  renderService = (svc) => {
    return new Promise((res) => {
      const {service, config} = svc;
      child.execSync(`mkdir -p /etc/puk/tmp/${service}`);
      // run
      fs.writeFileSync(`/etc/puk/tmp/${service}/run`, this.evalDoc(`/etc/puk/services/${service}/run`), {
        mode: '1755'
      });
      // finish
      fs.writeFileSync(`/etc/puk/tmp/${service}/finish`, this.evalDoc(`/etc/puk/services/${service}/finish`), {
        mode: '1755'
      });
      // // mv tmp dir to /etc/service
      child.execSync(`mv /etc/puk/tmp/${service} /etc/service/`);
      child.execSync(`rm -rf /etc/puk/tmp/${service}`);
      config.files.map(file => {
        console.log('rendering file', file);
        child.execSync(`mkdir -p ${file.path}`);
        fs.writeFileSync(`${file.path}/${file.filename}`, this.evalDoc(`/etc/puk/services/${service}/files/${file.filename}`), 'utf8', {
          mode: '1766'
        });
      });
      res();
    });
  }
  flow = (services, configuration) => {
    return Promise.all(services.map(svc=>this.renderService(svc)));
  }
  getDirectories(source){
    return readdirSync(source, {withFileTypes: true})
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
  }
}
export default Renderer;
