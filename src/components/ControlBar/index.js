import './ControlBar.scss';

import parser from '../../modules/parser';
import Component from '../../modules/component';

import '../Button';

export default class ControlBar extends Component {
  constructor(props) {
    super(props);

    this._handleClickAdd = this._handleClickAdd.bind(this);
    this._handleClickRemove = this._handleClickRemove.bind(this);
  }

  _handleClickAdd(sectionType) {
    this.props.store.dispatch({ type: 'SECTION_ADD', payload: { type: sectionType, content: '', after: this.props.sectionId } });
  }

  _handleClickRemove() {
    this.props.store.dispatch({ type: 'SECTION_REMOVE', payload: this.props.sectionId });
  }

  render() {
    return parser `
      <div className="ContentElement__controlBar ControlBar">
        <button className="ControlBar__button Button" onClick=${() => this._handleClickAdd('title')}>H2</button>
        <button className="ControlBar__button Button" onClick=${() => this._handleClickAdd('paragraph')}>T</button>
        <button className="ControlBar__button Button" onClick=${this._handleClickRemove}>X</button>
      </div>
    `;
  }
}