import Server from './common/server.mjs';
import sqlite from 'better-sqlite3';
const db = sqlite('/root/pdns.sqlite3', { verbose: console.log });
class API {
  constructor(){
    db.pragma('journal_mode = WAL');
    // todo: remove this eventually
    const zone = db.prepare("INSERT INTO domains (name, type) VALUES ('example.com', 'NATIVE');");
    zone.run();
    const soa = db.prepare("INSERT INTO records (domain_id, name, content, type,ttl,prio) VALUES (1,'example.com','localhost admin.example.com 1 10380 3600 604800 3600','SOA',86400,NULL)");
    soa.run();
    const a = db.prepare("INSERT INTO records (domain_id, name, content, type,ttl,prio) VALUES (1,'example.com','192.0.2.10','A',120,NULL);")
    a.run();
    const preparedGetDomain = db.prepare("SELECT * FROM domains;");
    const preparedGetRecords = db.prepare("SELECT * FROM records WHERE domain_id = ?;");
    this.server = new Server({
      port: 8080
    });
    this.server.get('/hello', (req, res) => {
      res.status('400').send('hello there!');
    });
    this.server.get('/hello/:there', (req, res) => {
      res.status('200').send(req.params.there);
    });
    this.server.get('/domains', (req, res) => {
      res.status('200').send(JSON.stringify(preparedGetDomain.all()));
    });
    this.server.get('/domains/:id', (req, res) => {
      res.status('200').send(JSON.stringify(preparedGetRecords.all(req.params.id)));
    });
    this.server.start();
  } 
}

new API();
