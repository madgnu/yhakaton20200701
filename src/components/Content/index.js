import './Content.scss';

import parser from '../../modules/parser';
import Component from '../../modules/component';

import ContentBody from '../ContentBody';
import ContentHeader from '../ContentHeader';

export default class Content extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    document.title = this.props.page.header.title;
    return parser `
      <div className="Root__content Content">
        <${ContentHeader} store=${this.props.store} />
        <${ContentBody} store=${this.props.store} />
      </div>
    `;
  }
}