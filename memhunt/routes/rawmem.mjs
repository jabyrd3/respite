import rawmem from '../utils/rawmem.mjs';
import dump from 'buffer-hexdump';
export default (server) => {
  server.get('/rawmem/:pid/:start/:end', (req, res) => {
    rawmem(req.params.pid, req.params.start, req.params.end)
      .then((raw) => {
        console.log('it worked!', raw);
        res.status('200').send(dump(raw));
      })
      .catch(e => {
        console.error('errored out somehow', e);
        res.status('500').send('ope');
      });
  });
};
