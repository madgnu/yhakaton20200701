import './ControlBar.scss';

import parser from '../../modules/parser';
import Component from '../../modules/component';

import '../Button';

export default class ControlBar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return parser `
      <div className="ContentElement__controlBar ControlBar">
        <button className="ControlBar__button Button">+</button>
        <button className="ControlBar__button Button">-</button>
      </div>
    `;
  }
}