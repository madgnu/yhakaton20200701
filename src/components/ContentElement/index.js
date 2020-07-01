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

    this.handleContentChange = this.handleContentChange.bind(this);
    this._getContentFromStore = this._getContentFromStore.bind(this);

    this.state = {
      content: this._getContentFromStore(this.props.store.getState()),
    };
  }

  _getContentFromStore(store) {
    return store.page.body.find((el) => el.id == this.props.key);
  }

  handleContentChange() {
    this.props.store.dispatch({ action: 'SECTION_MODIFY', payload: this.state.content });
  }

  render() {
    const data = this.state.content;
    return parser `
      <div className="ContentElement">
        <${data.type} className=${`ContentElement__content ContentElement__content_${modifClassName[data.type]}`} contenteditable="true" onFocusout=${this.handleContentChange}>${data.content}</${data.type}>
        <${ControlBar} />
      </div>
    `;
  }

  componentDidMount() {
    this._storeUnsub = (newStoreState) => {
      const newContent = this._getContentFromStore(newStoreState);
      if (newContent !== this.state.content) this.setState({ ...this.state, content: newContent });
    }
  }

  componentWillUnmount() {
    this._storeUnsub();
  }
}
