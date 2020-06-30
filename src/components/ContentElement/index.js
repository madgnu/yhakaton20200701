import './ContentElement.scss';

import parser from '../../modules/parser';
import Component from '../../modules/component';

import ControlBar from '../ControlBar';

const modifClassName = {
  p: 'paragraph',
  h2: 'title'
}

export default class ContentElement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contentEditable: false
    };
  }

  render() {
    const data = this.props.data;
    return parser `
      <div className="ContentElement">
        <${data.type} className=${`ContentElement__content ContentElement__content_${modifClassName[data.type]}`} key=${this.props.key} contenteditable="true">${data.content}</${data.type}>
        <${ControlBar} />
      </div>
    `;
  }
}
