export default class Cache {
  constructor(){
    const localStorageVals = window.localStorage.getItem('respiteddi');
    if(localStorageVals === null) {
      this.state = {};
    } else {
      this.state = JSON.parse(localStorageVals);
    }
  }
  set(key, val){
    console.log(`setting ${key} to ${val} in localstorage`);
    this.state[key] = val;
    // magic timeout to get it off render thread
    setTimeout(() => window.localStorage.setItem('respiteddi', JSON.stringify(this.state)), 0);
  }
  get(key){
    return this.state[key];
  }
  clear(){
    window.localStorage.removeItem('respiteddi');
  }
}
