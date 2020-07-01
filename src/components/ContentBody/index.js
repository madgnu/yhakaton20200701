import parser from '../../modules/parser';
import Component from '../../modules/component';

import ContentElement from '../ContentElement';

export default class ContentBody extends Component {
  constructor(props) {
    super(props);
    this.state = {
      elements: this.props.store.getState().page.body,
    }
  }

  render() {
    const content = this.state.elements;
    const chields = content.map((el) => parser `<${ContentElement} key=${el.id} store=${this.props.store} />`);
    return parser `
      <main className="ContentBody">
        ${chields}
      </main>
    `;
  }

  componentDidMount() {
    this._storeUnsub = (newStoreState) => this.state.elements != newStoreState.body && this.setState({...this.state, elements: newStoreState.body});
  }

  componentWillUnmount() {
    this._storeUnsub();
  }
}