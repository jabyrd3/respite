import Server from './common/server.mjs';
import sqlite from 'better-sqlite3';
import {readdir} from 'fs';

// todo: make verbose mode configurable via env var
const db = sqlite('/root/pdns/pdns.sqlite3', { verbose: console.log });
class API {
  constructor(){
    this.server = new Server({
      port: 8080
    });

    // chore to dynamically import route definitions
    readdir('/api/routes', (err, files) => {
      files.forEach(file => {
        const module = import(`/api/routes/${file}`)
          .then(m => {
            m.default(this.server, db);
          });
      });
    });

    this.server.start();
  } 
}

new API();
