import Server from './common/server.mjs';
import {readdir} from 'fs';
import pmap from './utils/pmap.mjs';
import {readFileSync} from 'fs';
class API {
  constructor(){
    this.server = new Server({
      port: 8081
    });
    // chore to dynamically import route definitions
    readdir('/memhunt/routes', (err, files) => {
      files.forEach(file => {
        const module = import(`/memhunt/routes/${file}`)
          .then(m => {
            console.log('registering', file);
            m.default(this.server);
          }).catch(console.error);
      });
    });
    this.server.fallbackStatic('/memhunt/gui');
    this.server.start();
  } 
}

new API();
process.on('uncaughtException', console.error);
