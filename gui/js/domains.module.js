import {Component} from 'https://unpkg.com/preact?module';
import List from './list.module.js';
export default class Domains extends Component {
  constructor(props) {
    super(props);
    this.state = {
      domainName: ''
    };
    this.fetchAll();
  }
  fetchAll = () => {
    nd.get('domain')
      .then(domains => {
        this.props.store({domains});
      })
      .catch(console.error);
  }
  change = e => {
    console.log(e.currentTarget.attributes['data-name'].value)
    this.setState({
      [e.currentTarget.attributes['data-name'].value]: e.currentTarget.value
    })
  }
  onSubmit = (e) => {
    e.stopPropagation();
    e.preventDefault();
    nd.post(`domain/${this.state.domainName}`)
      .then(res=>{
        this.setState({
          domainName: ''
        });
        this.fetchAll();
        console.log(res)
      })
      .catch(console.error)
  }
  render(){
    // ${this.props.state.domains.map(domain => html`<pre>${JSON.stringify(domain, null, 2)}</pre>`)}
    return html`<div class="whole">
      <h1>domains</h1>
      <${List} class="wrap flex flex-wrap" items=${this.props.state.domains} columns=${[
        item => html`<a onClick=${() => {window.location.hash = `domains/${item.id}`}}>${item.name}</a>`,
        item => html`${item.records.length} records`
      ]}/>
      <form onSubmit=${this.onSubmit}>
        <input type="text" value=${this.state.domainName} onInput=${this.change} data-name="domainName" />
        <button role="submit">create domain</button>
      </form>
    </div>`;
  }
}
