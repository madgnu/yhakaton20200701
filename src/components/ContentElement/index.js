import './ContentElement.scss';

import parser from '../../modules/parser';
import Component from '../../modules/component';

import ControlBar from '../ControlBar';

const tagType = {
  'paragraph': 'p',
  'title': 'h2'
}

export default class ContentElement extends Component {
  constructor(props) {
    super(props);

    this.handleContentChange = this.handleContentChange.bind(this);
    this._getContentFromStore = this._getContentFromStore.bind(this);
    this._handleFocus = this._handleFocus.bind(this);

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

  _handleFocus() {
    if (!this.state.content.content) {
      const sectionField = document.querySelector(`#section${this.props.key}`);
      sectionField.textContent = '';
    }
  }

  render() {
    const data = this.state.content;
    const movingSectionId = this.state.movingSectionId;
    console.log(data.content, !data.content);
    if (movingSectionId && movingSectionId !== this.props.key) {
      return parser `
        <div className="ContentElement">
          <div className="ContentElement__wrapper">
              <${tagType[data.type]} id=${'section'+this.props.key} className=${`ContentElement__content ContentElement__content_${data.type} ${(!data.content) ? 'ContentElement__content_empty' : ''}`} contenteditable="true" onFocusOut=${this.handleContentChange} >${data.content}</${tagType[data.type]}>
          </div>
          <div className="ContentElement__dropframe">
            <div className="ContentElement__dropzone" data-id=${this.props.key} data-part="upper"></div>
            <div className="ContentElement__dropzone" data-id=${this.props.key} data-part="lower"></div>
          </div>
        </div>
      `;
    }
    return parser `
      <div className="ContentElement">
        <div className="ContentElement__wrapper">
            <${tagType[data.type]} id=${'section'+this.props.key} className=${`ContentElement__content ContentElement__content_${data.type} ${(!data.content) ? 'ContentElement__content_empty' : ''}`} contenteditable="true" onFocusout=${this.handleContentChange} onFocusIn=${this._handleFocus}>${(data.content) ? data.content : 'Введите текст'}</${tagType[data.type]}>
            <${ControlBar} store=${this.props.store} sectionId=${this.props.key} />
        </div>
      </div>
    `;
  }

  componentDidMount() {
    this._storeUnsub = this.props.store.subscribe((newStoreState) => {
      const newContent = this._getContentFromStore(newStoreState);
      if ((newContent && newContent !== this.state.content) || (newStoreState.movingSectionId != this.state.movingSectionId)) this.setState({ content: newContent, movingSectionId: newStoreState.movingSectionId });
    });
  }

  componentWillUnmount() {
    this._storeUnsub();
  }
}
