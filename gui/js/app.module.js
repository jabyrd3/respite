// import Component from '/js/component.module.js';
// todo: write preact, theres a stash around with a stab at starting it
import { h, Component, render } from 'https://unpkg.com/preact?module';
import htm from 'https://unpkg.com/htm?module';
import Domains from './domains.module.js';
import Login from './login.module.js';
import ND from './nd.module.js';
import Cache from './cache.module.js';

// Initialize htm with Preact
const html = htm.bind(h);
// setup globals
//   html is for preacts html template literals, 
//   cache is for localstorage
//   nd is networkdad
window.html = html;
window.cache = new Cache();
const session = cache.get('session');
window.nd = new ND(session);
window.unauthHook = () => {
  cache.clear();
  window.location.hash = '';
}
// todo: figure out how to emulate redux and connect it to preact
// class Store {
//   constructor(){
//     this.state = {};
//     // this.actions = {};
//   }
//   getState(){
//     return this.state;
//   }
//   getItem(key){
//     console.log("getitem called", this.state);
//     return this.state[key];
//   }
//   mutate(ns){
//     console.log('mutate called', ns);
//     this.state = {
//       ...this.state,
//       ...ns
//     };
//   }
// }

// const store = new Store();
// store.mutate({foo: 'bustin'});

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      hash: session ? '#domains' : window.location.hash,
      domains: []
    };
  }
  componentDidMount() {
    window.addEventListener("hashchange", this.updateHash, false);
  }
  componentWillUnmount() {
    window.removeEventListener("hashchange", this.updateHash, false);
  }
  updateHash = () => {
    if(window.location.hash !== this.state.hash){
      this.setState({
        hash: window.location.hash
      });
    }
  }
  updateRootState = (state) => {
    this.setState(state);
  }
  render(){
    switch(this.state.hash){
      case '':
        return html`<div><${Login} store=${this.updateRootState} cache=${cache} /></div>`;
      case '#login':
        return html`<div><${Login} store=${this.updateRootState} cache=${cache} /></div>`;
      case '#domains':
        return html`<div><${Domains} store=${this.updateRootState} state=${this.state} /></div>`;
    }
  }
}

render(html`<${App}/>`, document.querySelector('#main'));
