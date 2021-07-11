import vmap from '../utils/vmapped.mjs';
import render from '../pages/vmap.mjs';
export default (server) => {
  server.get('/vmap/:pid/:range', (req, res) => {
    const {pid, range} = req.params;
    res.status('200').send(render(vmap(pid, range), pid));
  });
};
