import {Component} from 'https://unpkg.com/preact?module';
export default class Domains extends Component {
  constructor(props) {
    super(props);
    nd.get('domain').then(domains => {
      this.props.store({domains});
    }).catch(console.error);
  }
  render(){
    return html`<div>
      <h1>fuck</h1>
      ${this.props.state.domains.map(domain => html`<pre>${JSON.stringify(domain, null, 2)}</pre>`)}
      ${this.props.state.domains.map(domain => html`<a onClick=${() => {window.location.hash = `domains/${domain.id}`}}>${domain.name}</a>`)}
    </div>`;
  }
}
