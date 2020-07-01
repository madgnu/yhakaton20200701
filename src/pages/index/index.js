import render from '../../modules/render';
import parser from '../../modules/parser';
import { createStore, applyMiddleware } from '../../modules/store';

import Content from '../../components/Content';
import '../../components/Root';

import defaultPage from '../../data/default';

const initialState = {
  page: JSON.parse(localStorage.getItem('store')),
  popupOpened: false
};
if (!initialState.page) initialState.page = defaultPage;

const loggerMiddleware = (store) => (next) => (action) => {
  const oldState = store.getState();
  const newState = next(action);
  console.log('%c OLD_STATE ===> ', 'color: red;', oldState);
  console.log('%c ACTION ===> ', 'color: cyan;', action);
  console.log('%c NEW_STATE ===> ', 'color: green;', newState);

  return newState;
}

const localStorageMiddleware = (store) => (next) => (action) => {
  const newState = next(action);
  localStorage.setItem('store', JSON.stringify(newState.page));
  return newState;
}

function reducer(state, action) {
  switch (action.type) {
    case 'HEADER_MODIFY': return { ...state, page: { ...state.page, header: action.payload } };
    case 'POPUP_TOGGLE': return { ...state, popupOpened: !state.popupOpened };
    case 'SECTION_ADD': {
      const arrayPos = state.page.body.findIndex((el) => el.id == action.payload.after);
      const newElemArray = [...state.page.body];
      newElemArray.splice(arrayPos + 1, 0, { id: Math.floor(Math.random() * 100000) + 'x' + Date.now(), type: action.payload.type, content: '' });
      return { ...state, page: { ...state.page, body: newElemArray } };
    }
    case 'SECTION_REMOVE':
      return { ...state, page: { ...state.page, body: state.page.body.filter((el) => el.id != action.payload) } }
    case 'SECTION_MODIFY': {
      const arrayPos = state.page.body.findIndex((el) => el.id == action.payload.id);
      const newElemArray = [...state.page.body];
      newElemArray.splice(arrayPos, 1, action.payload);
      return { ... state, page: { ...state.page, body: newElemArray } };
    }
    case 'SECTION_DRAG': {
      return { ... state, movingSectionId: action.payload };
    }
    case 'SECTION_DRAG_CANCEL': {
      return { ... state, movingSectionId: false };
    }
    case 'SECTION_MOVE': {
      const section = state.page.body.find((el) => el.id == state.movingSectionId)
      const newElemArray = state.page.body.filter((el) => el.id != state.movingSectionId);
      const arrayPos = newElemArray.findIndex((el) => el.id == action.payload.target);
      newElemArray.splice(arrayPos + (action.payload.type == 'after'), 0, section);
      return { ... state, movingSectionId: false, page: { ...state.page, body: newElemArray } };
    }
    default: return state;
  }
}

const store = applyMiddleware(createStore(reducer, initialState), localStorageMiddleware, loggerMiddleware);


(() => {
  let currentPageTitle = store.getState().page.header.title;
  store.subscribe((newStoreState) => {
    const newPageTitle = newStoreState.page.header.title;
    if (currentPageTitle != newPageTitle) {
      document.title = newPageTitle;
      currentPageTitle = newPageTitle;
    }
  });
  document.title = currentPageTitle;
})();

render(parser `<${Content} store=${store} page=${defaultPage}/>`, document.querySelector('body'));