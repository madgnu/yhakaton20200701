import './ContentHeader.scss';

import parser from '../../modules/parser';
import Component from '../../modules/component';

export default class ContentHeader extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const data = this.props.content;
    return parser `
      <header className="Content__header ContentHeader">
        <img className="ContentHeader__logo" src="${data.logo.url}" />
        <h1 className="ContentHeader__title">${data.title}</h1>
      </header>
    `;
  }
}