import http from 'http';
import url from 'url';

export default class Server {
  constructor(config){
    this.config = config;
    this.router = this.router.bind(this);
    this.stop = this.stop.bind(this);
    this.server = http.createServer(this.router);
    this.routes = {};
  }
  get(route, handler){
    this.routes[`GET:${route}`] = handler;
  }
  post(route, handler){
    this.routes[`POST:${route}`] = handler;
  }
  delete(route, handler){
    this.routes[`DELETE:${route}`] = handler;
  }
  put(route, handler){
    this.routes[`PUT:${route}`] = handler;
  }
  router(req, res){
    const pUrl = url.parse(req.url);
    const routesByType = Object.keys(this.routes)
      .filter(route => route.indexOf(req.method) === 0);
    const route = routesByType.find(route=>route.includes(pUrl.pathname));
    if (!route) {
      console.log(`INFO: no handler for ${pUrl.pathname}`);
      return;
    }
    let data = [];
    req.on('data', chunk => {
      data.push(chunk);
    });
    req.on('end', () => {
      const sData = data.toString();
      const resWrapped = Object.assign(res, {
        send: res.end,
        status: sc => {
          res.statusCode = sc;
          return resWrapped;
        }
      });
      const reqWrapped = Object.assign({}, req, {data: sData});
      this.routes[route](reqWrapped, resWrapped);
    });
  }
  start(){
    this.server.listen(this.config.port);
  }
  stop(){
    try {
      this.server.close();
    } catch (e) {
      console.log('unable to destroy http server', e);
    }
  }
}
