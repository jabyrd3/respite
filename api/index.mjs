import Server from './common/server.mjs';
import sqlite from 'better-sqlite3';
import {readdir} from 'fs';

// todo: make verbose mode configurable via env var
const db = sqlite('/root/pdns/pdns.sqlite3', { verbose: console.log });
class API {
  constructor(){
    // WAL mode makes sqlite go fast and pdns is defaulting to it
    db.pragma('journal_mode = WAL');
    // todo: remove this eventually
    const user = db.prepare("INSERT INTO users (username, password) VALUES (?, ?)");
    user.run('foobar', 'password');
    user.run('demo', 'anotherpassword');
    const zone = db.prepare("INSERT INTO domains (name, type, owner) VALUES ('example.com', 'NATIVE', 1);");
    zone.run();
    const soa = db.prepare("INSERT INTO records (domain_id, name, content, type,ttl,prio) VALUES (1,'example.com','localhost admin.example.com 1 10380 3600 604800 3600','SOA',86400,NULL)");
    soa.run();
    const a = db.prepare("INSERT INTO records (domain_id, name, content, type,ttl,prio) VALUES (1,'example.com','192.0.2.10','A',120,NULL);")
    a.run();
    
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
