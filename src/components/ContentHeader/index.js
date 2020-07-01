import './ContentHeader.scss';

import parser from '../../modules/parser';
import Component from '../../modules/component';

import '../Popup';

export default class ContentHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      headerData: this.props.store.getState().page.header,
    };
    this._handleTitleChange = this._handleTitleChange.bind(this);
    this._handleLogoChange  =this._handleLogoChange.bind(this);
    this._handleLogoClick = this._handleLogoClick.bind(this);
  }

  _handleTitleChange(event) {
    this.props.store.dispatch({ type: 'HEADER_MODIFY', payload: { ...this.state.headerData, title: event.target.textContent } })
  }

  _handleLogoChange(event) {
    event.preventDefault();
    const urlInput = document.forms.logoChange.elements[0];
    if (!urlInput.checkValidity()) return;
    const newUrl = document.querySelector('#newLogo').value;
    this.props.store.dispatch({ type: 'HEADER_MODIFY', payload: { ...this.state.headerData, logo: { ...this.state.headerData.logo, url: newUrl } } });
  }

  _handleLogoClick() {
    this.props.store.dispatch({ type: 'POPUP_TOGGLE' });
  }

  render() {
    const data = this.props.store.getState().page.header;
    const popupOpened = this.props.store.getState().popupOpened;
    if (popupOpened) {
      return parser `
        <header className="Content__header ContentHeader">
          <div className="ContentHeader__wrapLogo">
            <img className="ContentHeader__logo" src="${data.logo.url}" onClick=${this._handleLogoClick} />
            <div className="ContentHeader__logoPopup Popup">
              <form name="logoChange" onClick=${this._handleLogoChange}>
                <input className="Popup__input Input" id="newLogo" type="url" placeholder="URL картинки" value=${data.logo.url} required="true" />
                <button className="Popup__button Button" type="submit">Сохранить</button>
              </form>
            </div>
          </div>
          <h1 className="ContentHeader__title" contenteditable="true" onFocusout=${this._handleTitleChange}>${data.title}</h1>
        </header>
      `;
    }
    return parser `
      <header className="Content__header ContentHeader">
        <div className="ContentHeader__wrapLogo">
          <img className="ContentHeader__logo" src="${data.logo.url}" onClick=${this._handleLogoClick} />
        </div>
        <h1 className="ContentHeader__title" contenteditable="true" onFocusout=${this._handleTitleChange}>${data.title}</h1>
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