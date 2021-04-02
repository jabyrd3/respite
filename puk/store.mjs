import * as actions from './actions';
export default class Store{
  constructor(defaults){
    this.state = defaults;
    // call hydratestore
    // put interval here to write a backup storefile every 15s by calling this.flushState
  }
  hydrateState(){
    // call this on boot
  }
  flushState(){
    // write state to disk async here
  }
  mutate(newSlice, tag='Untagged'){
    if(this[tag]){
      this[tag](newSlice);
      return this;
    }
    this.state = {...this.state, newSlice};
    return this;
    console.log('DEBUG: state mutated', tag);
  }
  getState(){
    return this.state; 
  }
}
