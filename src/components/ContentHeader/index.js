import './ContentHeader.scss';

import parser from '../../modules/parser';
import Component from '../../modules/component';
import createRef from '../../modules/refs';

import '../Popup';

export default class ContentHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      headerData: this.props.store.getState().page.header,
      popupOpened: false,
    };

    this._titleRef = createRef();
    this._logoUrlRef = createRef();

    this._handleTitleChange = this._handleTitleChange.bind(this);
    this._handleLogoChange  =this._handleLogoChange.bind(this);
    this._handleLogoClick = this._handleLogoClick.bind(this);
    this._handleTitleFocus = this._handleTitleFocus.bind(this);
  }

  _handleTitleChange() {
    this.props.store.dispatch({ type: 'HEADER_MODIFY', payload: { ...this.state.headerData, title: this._titleRef.current().textContent } })
  }

  _handleTitleFocus() {
    if (!this.state.headerData.title) {
      this._titleRef.current().textContent = '';
    }
  }

  _handleLogoChange(event) {
    event.preventDefault();
    const urlInput = document.forms.logoChange.elements[0];
    if (!urlInput.checkValidity()) return;
    const newUrl =this._logoUrlRef.current().value;
    this.props.store.dispatch({ type: 'HEADER_MODIFY', payload: { ...this.state.headerData, logo: { ...this.state.headerData.logo, url: newUrl } } });
    this.setState({ popupOpened: false });
  }

  _handleLogoClick() {
    this.setState({ popupOpened: !this.state.popupOpened });
  }

  render() {
    const data = this.state.headerData;
    const popupOpened = this.state.popupOpened;
    if (popupOpened) {
      return parser `
        <header className="Content__header ContentHeader">
          <div className="ContentHeader__wrapLogo">
            <img className="ContentHeader__logo" src="${data.logo.url}" onClick=${this._handleLogoClick} />
            <div className="ContentHeader__logoPopup Popup">
              <form name="logoChange" onSubmit=${this._handleLogoChange}>
                <input className="Popup__input Input" ref=${this._logoUrlRef} type="url" placeholder="URL картинки" value=${data.logo.url} required="true" />
                <button className="Popup__button Button" type="submit">Сохранить</button>
              </form>
            </div>
          </div>
          <h1 className=${`ContentHeader__title ${!data.title?'ContentHeader__title_empty':''}`} ref=${this._titleRef} contenteditable="true" onFocusin=${this._handleTitleFocus} onFocusout=${this._handleTitleChange}>${data.title?data.title:'Введите заголовок'}</h1>
        </header>
      `;
    }
    return parser `
      <header className="Content__header ContentHeader">
        <div className="ContentHeader__wrapLogo">
          <img className="ContentHeader__logo" src="${data.logo.url}" onClick=${this._handleLogoClick} />
        </div>
        <h1 className=${`ContentHeader__title ${!data.title?'ContentHeader__title_empty':''}`} ref=${this._titleRef} contenteditable="true" onFocusin=${this._handleTitleFocus} onFocusout=${this._handleTitleChange}>${data.title?data.title:'Введите заголовок'}</h1>
      </header>
    `;
  }

  componentDidMount() {
    this._storeUnsub = this.props.store.subscribe((newStoreState) => (this.state.headerData != newStoreState.header) && this.setState({ headerData: newStoreState.page.header }));
  }

  componentWillUnmount() {
    this._storeUnsub();
  }
}