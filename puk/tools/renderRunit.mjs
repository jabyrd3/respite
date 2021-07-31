import child from 'child_process';
import fs from 'fs';
import {readdir, readFile, writeFile, readdirSync} from 'fs';
import {promisify} from 'util';
import parseConfig from './parseConf.mjs';
// promisify to make em await-able
const ls = promisify(readdir);
const read = promisify(readFile);
const write = promisify(writeFile);

function pause(id) {
  return new Promise(resolve => setTimeout(() => {
    console.log(`pause ${id} is over`);
    resolve();
  }, 1500));
}

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
    .then(this.flow)
    .catch(console.error);
  }
  evalDoc = async (path, vals) => {
    const raw = fs.readFileSync(path, 'utf8');
    let done = true;
    if(raw.includes('async')){
      done = false
    }
    const output = eval('`' + raw + '`');
    while(done === false){
            await pause()
    }
    return done === true ? output : done;

  };
  renderService = (svc) => {
    return new Promise(async (res) => {
      const {service, config} = svc;
      child.execSync(`mkdir -p /etc/puk/tmp/${service}`);
      // run
      fs.writeFileSync(`/etc/puk/tmp/${service}/run`, await this.evalDoc(`/etc/puk/services/${service}/run`), {
        mode: '1755'
      });
      // finish
      fs.writeFileSync(`/etc/puk/tmp/${service}/finish`, await this.evalDoc(`/etc/puk/services/${service}/finish`), {
        mode: '1755'
      });
      // // mv tmp dir to /etc/service
      child.execSync(`mv /etc/puk/tmp/${service} /etc/service/`);
      child.execSync(`rm -rf /etc/puk/tmp/${service}`);
      config.files.map(async file => {
        console.log('rendering file', file);
        child.execSync(`mkdir -p ${file.path}`);
        fs.writeFileSync(`${file.path}/${file.filename}`, await this.evalDoc(`/etc/puk/services/${service}/files/${file.filename}`), 'utf8', {
          mode: '1766'
        });
      });
      res();
    });
  }
  flow = (services, configuration) => {
    // todo: do this filter shit better, string 'true' sucks
    return Promise.all(services.filter(svc => typeof svc.config.enable === 'undefined' || eval('`' + svc.config.enable + '`') === 'true')
      .map(svc => this.renderService(svc)));
  }
  getDirectories(source){
    return readdirSync(source, {withFileTypes: true})
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
  }
}
export default Renderer;
