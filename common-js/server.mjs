import http from 'http';
import url from 'url';
import crypto from 'crypto'; 
export default class Server {
  constructor(config){
    this.config = config;
    this.router = this.router.bind(this);
    this.stop = this.stop.bind(this);
    this.server = http.createServer(this.router);
    this.routes = {
      PUT: {},
      GET: {},
      POST: {},
      PATCH: {},
      DELETE: {}
    };
  }
  get(route, handler){
    this.assign('GET', route, handler);
  }
  post(route, handler){
    this.assign('POST', route, handler);
  }
  delete(route, handler){
    this.assign('DELETE', route, handler);
  }
  put(route, handler){
    this.assign('PUT', route, handler);
  }
  patch(route, handler){
    this.assign('PATCH', route, handler);
  }
  assign (method, route, handler) {
    const partitioned = route.split('/').filter(f=>f.length > 0);
    const rLen = partitioned.length;
    const unparams = partitioned.filter(p => p[0] !== ':');
    const params = partitioned.map((i, index) => i[0] === ':' ? {
      name: i.slice(1),
      index
    } : false).filter(f=>f);
    if(params.length > 1){
      console.log('ERROR: jordans stupid server only supports one param for now');
      process.exit(1);
    }
    if(params.length === 1){
      const hashedUnparams = crypto.createHash('sha1').update(unparams.join('/')).digest('base64');
      return this.routes[method][hashedUnparams] = {
        partitioned,
        rLen,
        unparams,
        params,
        route,
        handler
      };
    }
    this.routes[method][route] = {
            partitioned,
            rLen,
            unparams,
            params,
            route,
            handler
          };

  }
  pickRoute(method, pathname){
    // todo: unfuck this hashing shit, find a better way to deterministically pick the right route
    // this currently will only work if theres a single parameterized segment of the pathname
    // this is extremely temporary. youll need to fix the assign method and this method
    let route = false
    let iteration = 0;
    const split = pathname.split('/');
    if(this.routes[method][pathname]){
      return this.routes[method][pathname];
    }
    while (!route && iteration < 5){
      const skipped = split.map((i, idx) => idx !== iteration ? i : false).filter(f=>f).join('/');
      const genHash = crypto.createHash('sha1').update(skipped).digest('base64');
      if(this.routes[method][genHash]){
        return route = this.routes[method][genHash];
      }
      iteration++ 
    }
    return route;
  }
  router(req, res){
    const pUrl = url.parse(req.url);
    const route = this.pickRoute(req.method, pUrl.pathname);
    const splitRoute = pUrl.pathname.split('/').filter(f => f.length > 0);
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
      const reqWrapped = Object.assign({}, req, {
        data: sData,
        params: route && route.params.reduce((acc, val) => {
          return {
            ...acc,
            [val.name]: splitRoute[val.index]
          };
        }, {})
        
      });
      route && route.handler(reqWrapped, resWrapped);
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
