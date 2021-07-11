export default (server) => {
  // example routes for messing with server in common-js
  // simple demo route with middlewares
  server.get('/hello', (req, res) => {
    res.status('200').send('hello there!');
  });
};
