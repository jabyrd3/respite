// import Component from '/js/component.module.js';
// todo: write preact, theres a stash around with a stab at starting it
import { h, Component, render } from 'https://unpkg.com/preact?module';
import htm from 'https://unpkg.com/htm?module';
import ND from './nd.js';

// Initialize htm with Preact
const html = htm.bind(h);
let nd = new ND();
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

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  submit = (e) => {
    e.preventDefault();
    const {username, password} = this.state;
    nd.put('user/login', {
      username,
      password
    })
    .then(r => {
      console.log("success", r);
      nd = new ND(r.uuid);
      nd.get('domain').then(domains => {
        window.location.hash = 'domains';
        this.props.store({domains});
      }).catch(console.error);
    })
    .catch(console.error);
    console.log(this.state);
  }
  change = (e) => {
    this.setState({[e.target.attributes['data-attr'].value]: e.target.value});
  }
  render = () => {
    // value="${store.getItem('demo')}" 
    return html`<form class="login" onSubmit=${this.submit}>
      <input onInput=${this.change} data-attr="username" placeholder="username" />
      <input onInput=${this.change} data-attr="password" placeholder="password" /> 
      <button role="submit">submit</button>
      ${this.state.username}
      ${this.state.password}
    </form>`;
  }
}
class Domains extends Component {
  constructor(props) {
    super(props);
  }
  render(){
    return html`<div>
      ${this.props.state.domains.map(domain => html`<pre>${JSON.stringify(domain, null, 2)}</pre>`)}
    </div>`;
  }
}
class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      hash: window.location.hash,
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
        return html`<div><${Login} store=${this.updateRootState} /></div>`;
      case '#login':
        return html`<div><${Login} store=${this.updateRootState} /></div>`;
      case '#domains':
        return html`<div><${Domains} store=${this.updateRootState} state=${this.state} /></div>`;
    }
  }
}
render(html`<${App}/>`, document.querySelector('#main'));
