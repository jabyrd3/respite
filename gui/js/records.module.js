import {Component} from 'https://unpkg.com/preact?module';
export default class Domains extends Component {
  constructor(props) {
    super(props);
    const domainId = parseInt(window.location.hash.split('/')[1], 10);
    nd.get('domain').then(domains => {
      this.props.store({
        domains,
        viewingDomain: domains.find(d => d.id === domainId)
      });
    }).catch(console.error);
  }
  render(){
    console.log(this.props.state.viewingDomain);
    return html`<div>
      <h1>Records</h1>
      <pre>${JSON.stringify(this.props.state.viewingDomain, null, 2)}</pre>
    </div>`;
  }
}
