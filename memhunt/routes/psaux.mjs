import psaux from '../utils/psaux.mjs';
import renderPS from '../pages/psaux.mjs';
export default (server) => {
  server.get('/psaux', (req, res) => {
    res.status('200').send(renderPS(psaux()));
  });
};
