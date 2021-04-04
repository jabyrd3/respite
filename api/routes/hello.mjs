export default (server, db) => {
  // example routes for messing with server in common-js

  // simple demo route with middlewares
  server.get('/hello', [req => ({...req, foo: 'bar'}), req => ({...req, bim: 'baz'})], (req, res) => {
    res.status('200').send(`hello there! from middlewares: ${req.foo} ${req.bim}`);
  });

  // param demo with single middleware
  server.get('/hello/:there', [req => ({...req, bare: req.params.there})], (req, res) => {
    res.status('200').send(`hello, from params direct: ${req.params.there}. from middleware ${req.bare}`);
  });

  // this doesn't work yet because i was tired and bruteforced routematching
  // server.get('/hello/:there/:secondparam', (req, res) => {
  //   res.status('200').send(`${req.params.there}${req.params.secondparam}`);
  // });
};
