import {Component} from 'https://unpkg.com/preact?module';
export default class List extends Component {
  constructor(props){
    super(props);
  }
  render(){
    console.log(this.props.items)
    return html`<div class="${this.props.class} list">
      ${this.props.items.map(item => {
        return html`<div class="whole">${this.props.columns.map(column => {
          return html`<div class="cell">${column(item)}</div>`})}</div>`
        })
      }
    </div>`;
  }
}
