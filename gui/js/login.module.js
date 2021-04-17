import {Component} from 'https://unpkg.com/preact?module';
import NetworkDad from './nd.module.js';
export default class Login extends Component {
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
      window.nd = new NetworkDad(r.uuid);
      cache.set('session', r.uuid);
      window.location.hash = 'domains';
    })
    .catch(console.error);
  }
  change = (e) => {
    this.setState({[e.target.attributes['data-attr'].value]: e.target.value});
  }
  render = () => {
    return html`<form class="login" onSubmit=${this.submit}>
      <input onInput=${this.change} data-attr="username" placeholder="username" />
      <input onInput=${this.change} data-attr="password" placeholder="password" /> 
      <button role="submit">submit</button>
      ${this.state.username}
      ${this.state.password}
    </form>`;
  }
}
