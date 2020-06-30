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
    return parser `
      <div className="Root__content Content">
        <${ContentHeader} content=${this.props.page.header} />
        <${ContentBody} content=${this.props.page.body} />
      </div>
    `;
  }
}