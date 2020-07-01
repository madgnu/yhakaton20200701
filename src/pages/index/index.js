import render from '../../modules/render';
import parser from '../../modules/parser';
import createStore from '../../modules/store';

import Content from '../../components/Content';
import '../../components/Root';

import defaultPage from '../../data/default';

const initialState = {
  page: defaultPage
};

function reducer(state, action) {
  console.log(action);
  switch (action.type) {
    case 'HEADER_MODIFY': return { ...state, page: { ...state.page, header: action.payload } };
    case 'SECTION_MODIFY':
      const arrayPos = state.page.body.find((el) => el.id == action.payload.id);
      return { ... state, page: { ...state.page, body: state.page.body.splice(arrayPos, 1, action.payload) } };
    default: return state;
  }
}

const store = createStore(reducer, initialState);

render(parser `<${Content} store=${store} page=${defaultPage}/>`, document.querySelector('body'));