//import './Content.scss';

import parser from '../../modules/parser';
import Component from '../../modules/component';

import ContentBody from '../ContentBody';

export default class Content extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return parser `
      <main className="Content">
        <${ContentBody} content=${this.props.page.body} />
      </main>`;
  }
}