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

  shouldComponentUpdate(nextState) {
    return this.state.elements.reduce((acc, el) => acc + el.id, '') != nextState.elements.reduce((acc, el) => acc + el.id, '');
  }

  componentDidMount() {
    this._storeUnsub = this.props.store.subscribe((newStoreState) =>this.setState({ elements: newStoreState.page.body }));
  }

  componentWillUnmount() {
    this._storeUnsub();
  }
}