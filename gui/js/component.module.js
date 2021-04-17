export default class Component {
  constructor(store){
    this.store = store;
    window[this.constructor.name] = this;
  }
  render(){
    return `foo bar baz`
  }
}
