class NetworkDad {
  constructor(key){
    if(key) {
      this.key = key;
    }
    return this;
  }
  get(route){
    return this.request(route, 'GET');
  }
  post(route, body){
    return this.request(route, 'POST', body);
  }
  put(route, body){
    return this.request(route, 'PUT', body);
  }
  patch(route, body){
    return this.request(route, 'PATCH', body);
  }
  delete(route){
    return this.request(route, 'DELETE');
  }
  request = (route, method, body) => {
    return new Promise((resolve, reject) => {
      fetch(`${window.location.origin}/${route}`, {
        method,
        headers: body ?
          {
            'Content-Type': 'application/json',
            'session': this.key
          } :
          {
            'session': this.key
          },
        body: body ? JSON.stringify(body) : undefined
      })
      .then(async response => {
        if (!response.ok){
          // send json err messages so that this works
          return reject(await response.json());
        }
        try {
          const json = await response.json();
          return resolve(json);
        } catch (e){
          return resolve(response);
        }
      })
      .catch(reject);
    });
  }
}
export default NetworkDad;
