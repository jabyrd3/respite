import getSession from '../middlewares/getSession.mjs';
export default (server, db) => {
  const preparedGetDomain = db.prepare("SELECT * FROM domains WHERE owner = ?;");
  const getSingleDomain = db.prepare("SELECT * FROM domains WHERE name = ?;");
  const preparedPutDomain = db.prepare("INSERT INTO domains (name, type, owner) VALUES (?, 'NATIVE', ?);");
  server.post('/domain/:domain', [getSession], (req, res) => {
    const existing = getSingleDomain.get(req.params.domain);
    if(existing){
      return res.status(400)
        .send(`the domain, ${req.params.domain} already exists in the system.`);
    }
    res.status(200).send(JSON.stringify(preparedPutDomain.run(req.params.domain, req.session.user)));
  });
  server.get('/domain', [getSession], (req, res) => {
    res.status('200').send(JSON.stringify(preparedGetDomain.all(req.session.user)));
  });
};
