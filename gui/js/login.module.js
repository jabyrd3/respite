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
    return html`
      <h1 class="quarter" style="padding-top: 38vh">Respite DDI</h1>
      <form class="login flex wrapping quarter" style="padding-top: 40vh; margin-left: 40px;" onSubmit=${this.submit}>
      <input class="gutter-bottom" onInput=${this.change} data-attr="username" placeholder="username" autofocus="true" />
      <input class="gutter-bottom" onInput=${this.change} data-attr="password" placeholder="password" /> 
      <button class="center gutter-top" role="submit">submit</button>
    </form>`;
  }
}
