export default (server, db) => {
  const preparedGetRecords = db.prepare("SELECT * FROM records WHERE domain_id = ?;");
  server.get('/domain/:id', (req, res) => {
    console.log('getdomainhandler hit');
    res.status('200').send(JSON.stringify(preparedGetRecords.all(req.params.id)));
  });
};
