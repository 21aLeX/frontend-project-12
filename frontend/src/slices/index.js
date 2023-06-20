import { configureStore, combineReducers } from '@reduxjs/toolkit';
// import reducer from './slice.js';
import reducerMessages from './sliceMessages.js';
import reducerChannels from './sliceChannels.js';
import reducerUser from './sliceUser.js';

export default configureStore({
  reducer: {
    // data: reducer,
    data: combineReducers({
      messages: reducerMessages,
      channels: reducerChannels,
      user: reducerUser,
    }),
  },
});
