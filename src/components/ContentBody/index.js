import parser from '../../modules/parser';
import Component from '../../modules/component';

import ContentElement from '../ContentElement';

export default class ContentBody extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const content = this.props.content;
    console.log(content);
    const chields = content.map((el, i) => parser `<${ContentElement} key=${i} data=${el} />`);
    return parser `
      <main className="ContentBody">
        ${chields}
      </main>
    `;
  }
}