import { configureStore, combineReducers } from '@reduxjs/toolkit';
import reducerMessages from './sliceMessages.js';
import reducerChannels from './sliceChannels.js';
import reducerModals from './sliceModals.js';

export default configureStore({
  reducer: {
    data: combineReducers({
      messages: reducerMessages,
      channels: reducerChannels,
      modals: reducerModals,
    }),
  },
});
