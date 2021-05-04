import http from 'http';
import url from 'url';
import crypto from 'crypto'; 
import fs from 'fs';
export default class Server {
  constructor(config, mwExtras){
    this.config = config;
    this.router = this.router.bind(this);
    this.stop = this.stop.bind(this);
    this.server = http.createServer(this.router);
    this.mwExtras = mwExtras;
    this.routes = {
      PUT: {},
      GET: {},
      POST: {},
      PATCH: {},
      DELETE: {}
    };
  }
  unpackArgs(args){
    let route, middlewares=[], handler;
    args.forEach(arg => {
      if(typeof arg === 'function'){
        return handler = arg;
      }
      if(typeof arg === 'string'){
        return route = arg;
      }
      if(typeof arg.length !== 'undefined'){
        return middlewares = arg;
      }
    });
    return {route, middlewares, handler};
  }
  get(...args){
    const {route, middlewares, handler} = this.unpackArgs(args);
    this.assign('GET', route, middlewares, handler);
  }
  post(...args){
    const {route, middlewares, handler} = this.unpackArgs(args);
    this.assign('POST', route, middlewares, handler);
  }
  delete(...args){
    const {route, middlewares, handler} = this.unpackArgs(args);
    this.assign('DELETE', route, middlewares, handler);
  }
  put(...args){
    const {route, middlewares, handler} = this.unpackArgs(args);
    this.assign('PUT', route, middlewares, handler);
  }
  patch(...args){
    const {route, middlewares, handler} = this.unpackArgs(args);
    this.assign('PATCH', route, middlewares, handler);
  }
  fallbackStatic(dir){
    //todo add static caching for prod mode
    this.fallbackDir = dir;
  }
  assign (method, route, middlewares, handler) {
    const partitioned = route.split('/').filter(f=>f.length > 0);
    const rLen = partitioned.length;
    const unparams = partitioned.filter(p => p[0] !== ':');
    const params = partitioned.map((i, index) => i[0] === ':' ? {
      name: i.slice(1),
      index
    } : false).filter(f=>f);
    this.routes[method][partitioned.join('/')] = {
            partitioned,
            middlewares,
            rLen,
            unparams,
            params,
            route,
            handler
          };

  }
  mime(type){
    const suffix = type[0].split('.').slice(-1)[0];
    switch(suffix){
      case 'js':
        return 'text/javascript';
      case 'html':
        return 'text/html';
      case 'ico':
        return 'image/x-icon';
      case 'css':
        return 'text/css';
    }
  }
  pickRoute(method, pathname){
    // todo: unfuck this hashing shit, find a better way to deterministically pick the right route
    // this currently will only work if theres a single parameterized segment of the pathname
    // this is extremely temporary. youll need to fix the assign method and this method
    let iteration = 0;
    const split = pathname.split('/').filter(f => f && f.length > 0);
    if(this.routes[method][pathname]){
      return this.routes[method][pathname];
    }
    const availRoutes = this.routes[method];
    const rKey = Object.keys(availRoutes).find(rk => {
      const inspectingRoute = this.routes[method][rk];
      if(rk.indexOf('domain') > -1){
        debugger;
      }
      if(split.length !== inspectingRoute.rLen || inspectingRoute.unparams.some(up => !split.includes(up))){
        return false;
      }
      return true;
    });
    return this.routes[method][rKey];
  }
  router(req, res){
    const pUrl = url.parse(req.url);
    const route = this.pickRoute(req.method, pUrl.pathname);
    const splitRoute = pUrl.pathname.split('/').filter(f => f.length > 0);
    if (!route) {
      return fs.stat(`${this.fallbackDir}/${splitRoute.join('/')}`, (err, stats) => {
        if(err){
          console.log(`INFO: no handler for ${pUrl.pathname}`, err);
          return;
        }
        res.statusCode = 200
        res.setHeader("Content-Type", this.mime(splitRoute.slice(-1)));
        res.end(fs.readFileSync(`${this.fallbackDir}/${splitRoute.join('/')}`));
      });
    }
    let data = [];
    req.on('data', chunk => {
      data.push(chunk);
    });
    req.on('end', () => {
      const sData = data.toString();
      let resWrapped = Object.assign(res, {
        send: res.end,
        status: sc => {
          res.statusCode = sc;
          return resWrapped;
        }
      });
      let reqWrapped = Object.assign({}, req, {
        data: sData && sData.length > 0 ? JSON.parse(sData) : '',
        params: route && route.params.reduce((acc, val) => {
          return {
            ...acc,
            [val.name]: splitRoute[val.index]
          };
        }, {})
      });
      // todo: finish middleware execution / chaining
      if(route.middlewares.length > 0){
        let toMiddle = [...route.middlewares];
        while (toMiddle.length > 0) {
          const mw = toMiddle.shift();
          const ran = mw(reqWrapped, resWrapped, this.mwExtras);
          reqWrapped = ran.req;
          resWrapped = ran.res;
          if(!resWrapped){
            toMiddle = [];
          }
        }
      }
      route && resWrapped && route.handler(reqWrapped, resWrapped);
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
