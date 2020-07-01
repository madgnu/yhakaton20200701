import './ControlBar.scss';

import parser from '../../modules/parser';
import Component from '../../modules/component';

import '../Button';

export default class ControlBar extends Component {
  constructor(props) {
    super(props);

    this._handleClickAdd = this._handleClickAdd.bind(this);
    this._handleClickRemove = this._handleClickRemove.bind(this);
    this._handleDragStart = this._handleDragStart.bind(this);
    this._handleDragEnd = this._handleDragEnd.bind(this);
  }

  _handleClickAdd(sectionType) {
    this.props.store.dispatch({ type: 'SECTION_ADD', payload: { type: sectionType, content: '', after: this.props.sectionId } });
  }

  _handleClickRemove() {
    this.props.store.dispatch({ type: 'SECTION_REMOVE', payload: this.props.sectionId });
  }

  _handleDragStart() {
    this.props.store.dispatch({ type: 'SECTION_DRAG', payload: this.props.sectionId });
    document.addEventListener('mouseup', this._handleDragEnd);
  }

  _handleDragEnd(event) {
    document.removeEventListener('mouseup', this._handleDragEnd);

    const target = event.target;
    console.log(event.target);
    if (target.classList.contains('ContentElement__dropzone')) {
      event.stopPropagation();
      const insertType = (target.dataset.part == 'upper') ? 'before' : 'after';
      const insertSectionId = target.dataset.id;
      this.props.store.dispatch({ type: 'SECTION_MOVE', payload: { target: insertSectionId, type: insertType } })
    } else this.props.store.dispatch({ type: 'SECTION_DRAG_CANCEL'});
  }

  render() {
    return parser `
      <div className="ContentElement__controlBar ControlBar">
        <button className="ControlBar__button Button" onClick=${() => this._handleClickAdd('title')}>H2</button>
        <button className="ControlBar__button Button" onClick=${() => this._handleClickAdd('paragraph')}>T</button>
        <button className="ControlBar__button Button" onClick=${this._handleClickRemove}>X</button>
        <button className="ControlBar__button Button Button_drag" onMouseDown=${this._handleDragStart}>D</button>
      </div>
    `;
  }
}