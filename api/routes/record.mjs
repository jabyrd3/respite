import getSession from '../middlewares/getSession.mjs';
export default (server, db) => {
  // const preparedGetRecords = db.prepare("select * from records INNER JOIN domains on records.domain_id = ? WHERE domains.owner = ?;");
  const preparedGetRecords = db.prepare("SELECT * FROM domains inner JOIN records r on r.domain_id = domains.id WHERE owner = ? AND r.domain_id = ?;");
  server.get('/domain/:id', [getSession], (req, res) => {
    res.status('200').send(JSON.stringify(preparedGetRecords.all(req.session.user, parseInt(req.params.id, 10))));
  });
};
