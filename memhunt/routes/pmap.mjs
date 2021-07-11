import pmap from '../utils/pmap.mjs';
import renderPmap from '../pages/pmap.mjs'
export default (server) => {
  server.get('/pmap/:pid', (req, res) => {
    const {pid} = req.params;
    res.status('200')
      .send(renderPmap(pmap(pid), pid));
  });
};
