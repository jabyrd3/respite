export default (server, db) => {
  const preparedGetDomain = db.prepare("SELECT * FROM domains;");
  const preparedPutDomain = db.prepare("INSERT INTO domains (name, type) VALUES (?, 'NATIVE');");
  server.put('/domain/:domain', (req, res) => {
    res.status(200).send(JSON.stringify(preparedPutDomain.run(req.params.domain)));
  });
  server.get('/domain', (req, res) => {
    res.status('200').send(JSON.stringify(preparedGetDomain.all()));
  });
};
