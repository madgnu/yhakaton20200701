export default function createStore(reducer, initialState = {}) {
  let _state = initialState;
  let _callbacks = [];

  const getState = () => _state;

  const dispatch = (action) => {
    _state = reducer(_state, action);
    _callbacks.forEach((callback) => callback(_state));
  };

  const subscribe = (cb) => {
    _callbacks.push(cb);
    return () => _callbacks.filter((e) => e !== cb);
  };

  return { getState, dispatch, subscribe };
}
