import getUser from '../middlewares/getUser.mjs';
export default (server, db) => {
  const preparedGetDomain = db.prepare("SELECT * FROM domains WHERE owner = ?;");
  const preparedPutDomain = db.prepare("INSERT INTO domains (name, type, owner) VALUES (?, 'NATIVE', ?);");
  server.post('/domain/:domain', [getUser], (req, res) => {
    res.status(200).send(JSON.stringify(preparedPutDomain.run(req.params.domain, req.userid)));
  });
  server.get('/domain', [getUser], (req, res) => {
    res.status('200').send(JSON.stringify(preparedGetDomain.all(req.userid)));
  });
};
