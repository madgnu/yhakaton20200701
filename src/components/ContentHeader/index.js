import './ContentHeader.scss';

import parser from '../../modules/parser';
import Component from '../../modules/component';

export default class ContentHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      headerData: this.props.store.getState().page.header,
    };
    this.handleTitleChange = this.handleTitleChange.bind(this);
  }

  handleTitleChange(event) {
    this.props.store.dispatch({ type: 'HEADER_MODIFY', payload: { ...this.state.headerData, title: event.target.textContent } })
  }

  render() {
    const data = this.props.store.getState().page.header;
    return parser `
      <header className="Content__header ContentHeader">
        <img className="ContentHeader__logo" src="${data.logo.url}" />
        <h1 className="ContentHeader__title" contenteditable="true" onFocusout=${this.handleTitleChange}>${data.title}</h1>
      </header>
    `;
  }

  componentDidMount() {
    this._storeUnsub = this.props.store.subscribe((newStoreState) => (this.state.headerData != newStoreState.header) && this.setState({...this.state, headerData: newStoreState.page.header }));
  }

  componentWillUnmount() {
    this._storeUnsub();
  }
}