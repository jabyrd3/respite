export default (server, db) => {
  // test routes for messing with server in common-js
  server.get('/hello', (req, res) => {
    res.status('400').send('hello there!');
  });
  server.get('/hello/:there', (req, res) => {
    res.status('200').send(req.params.there);
  });
  // this doesn't work yet because i was tired and bruteforced routematching
  // server.get('/hello/:there/:secondparam', (req, res) => {
  //   res.status('200').send(`${req.params.there}${req.params.secondparam}`);
  // });
};
