import getSession from '../middlewares/getSession.mjs';
export default (server, db) => {
  const preparedGetDomain = db.prepare("SELECT * FROM domains WHERE owner = ?;");
  const getSingleDomain = db.prepare("SELECT * FROM domains WHERE name = ?;");
  const preparedPutDomain = db.prepare("INSERT INTO domains (name, type, owner) VALUES (?, 'NATIVE', ?);");
  const preparedGetAllRecords = db.prepare('SELECT * FROM domains inner JOIN records r on r.domain_id = domains.id WHERE owner = ?;');
  server.post('/domain/:domain', [getSession], (req, res) => {
    const existing = getSingleDomain.get(req.params.domain);
    if(existing){
      return res.status(400)
        .send(`the domain, ${req.params.domain} already exists in the system.`);
    }
    res.status(200).send(JSON.stringify(preparedPutDomain.run(req.params.domain, req.session.user)));
  });
  server.get('/domain', [getSession], (req, res) => {
    const records = preparedGetAllRecords.all(req.session.user);
    const domains = preparedGetDomain.all(req.session.user);
    // todo: single query this shit cmon jordan ur better than this
    const zipped = domains.map(d => ({
      ...d,
      records: records.filter(r => r.domain_id === d.id)
    }));
    res.status('200').send(JSON.stringify(zipped));
  });
};
