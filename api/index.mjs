import Server from './common/server.mjs';
import sqlite from 'better-sqlite3';
import {readdir, appendFileSync} from 'fs';

// todo: make verbose mode configurable via env var
const db = sqlite('/root/pdns/pdns.sqlite3', { verbose: command => {
  if(['INSERT', 'DELETE', 'UPDATE', 'PRAGMA'].some(v => command.includes(v)) && command.indexOf('uuid()') === -1){
    appendFileSync('/root/pdns/op.log', `${command}\n`);
  }
}});
class API {
  constructor(){
    db.pragma('journal_mode = WAL');
    db.loadExtension('/uuid.so');
    this.server = new Server({
      port: 8080
    }, {db});
    // chore to dynamically import route definitions
    readdir('/api/routes', (err, files) => {
      files.forEach(file => {
        const module = import(`/api/routes/${file}`)
          .then(m => {
            m.default(this.server, db);
          });
      });
    });
    this.server.fallbackStatic('/gui');
    this.server.start();
  } 
}

new API();
