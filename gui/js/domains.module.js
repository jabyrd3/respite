import {Component} from 'https://unpkg.com/preact?module';
export default class Domains extends Component {
  constructor(props) {
    super(props);
    nd.get('domain').then(domains => {
      window.location.hash = 'domains';
      this.props.store({domains});
    }).catch(console.error);
  }
  render(){
    return html`<div>
      ${this.props.state.domains.map(domain => html`<pre>${JSON.stringify(domain, null, 2)}</pre>`)}
    </div>`;
  }
}
