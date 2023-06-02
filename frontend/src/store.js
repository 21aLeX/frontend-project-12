import redux from 'redux';

const { createStore } = redux;
const stateApp = (initialState) => {
  const reducer = (state = {}, action) => {
    // switch (action.type) {
    //   case 'TASK_ADD':
    //     return { [action.payload.task.id]: action.payload.task, ...state };
    //   case 'TASK_REMOVE':
    //     return omit(state, [action.payload.id]);
    //   default:
    //     return state;
    // }
  };
  const store = createStore(reducer, initialState);
  return store;
};
export default stateApp;
