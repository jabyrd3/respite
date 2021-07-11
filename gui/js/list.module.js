import {Component} from 'https://unpkg.com/preact?module';
export default class List extends Component {
  constructor(props){
    super(props);
  }
  render(){
    console.log(this.props.items)
    return html`<div class="list">
      ${this.props.items.map(item => {
        return this.props.columns.map(column => {
          return html`<div class="row">
            <div class="cell">${column(item)}</div>
          </div>`;
        })
      })}
    </div>`;
  }
}
