import getSession from '../middlewares/getSession.mjs';
export default (server, db) => {
  // const preparedGetRecords = db.prepare('select * from records INNER JOIN domains on records.domain_id = ? WHERE domains.owner = ?;');
  const preparedGetRecords = db.prepare('SELECT * FROM domains inner JOIN records r on r.domain_id = domains.id WHERE owner = ? AND r.domain_id = ?;');
  const createRecord = db.prepare('INSERT INTO records (domain_id, name, type, content, ttl, prio, disabled, ordername, auth) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);');
  server.get('/domain/:id', [getSession], (req, res) => {
    res.status('200').send(JSON.stringify(preparedGetRecords.all(req.session.user, parseInt(req.params.id, 10))));
  });
  server.post('/domain/:id/:name/:type', [getSession], (req, res) => {
    const ttl = req.data.ttl || 600;
    const prio = req.data.prio || 120;
    const disabled = 0;
    const ordername = null;
    createRecord.run(req.params.id, req.params.name, req.params.type.toUpperCase(), req.data.content, ttl, prio, disabled, ordername, 1);
    res.status(200).send('ok');
  });
};
