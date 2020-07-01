import './ContentElement.scss';

import parser from '../../modules/parser';
import Component from '../../modules/component';

import ControlBar from '../ControlBar';

const modifClassName = {
  'paragraph': 'p',
  'title': 'h2'
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

  handleContentChange(event) {
    this.props.store.dispatch({ type: 'SECTION_MODIFY', payload: { ...this.state.content, content: event.target.textContent } });
  }

  render() {
    const data = this.state.content;
    return parser `
      <div className="ContentElement">
        <${modifClassName[data.type]} className=${`ContentElement__content ContentElement__content_${data.type}`} contenteditable="true" onFocusout=${this.handleContentChange}>${data.content}</${modifClassName[data.type]}>
        <${ControlBar} store=${this.props.store} sectionId=${this.props.key} />
      </div>
    `;
  }

  componentDidMount() {
    this._storeUnsub = this.props.store.subscribe((newStoreState) => {
      const newContent = this._getContentFromStore(newStoreState);
      if (newContent && newContent !== this.state.content) this.setState({ content: newContent });
    });
  }

  componentWillUnmount() {
    this._storeUnsub();
  }
}
