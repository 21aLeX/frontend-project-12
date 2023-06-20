/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: [],
};

const sliceMessages = createSlice({
  name: 'sliceMessages',
  initialState,
  reducers: {
    setMessages: (state, { payload }) => {
      // console.log(payload);
      state.messages = payload;
    },
    addMessage: (state, { payload }) => {
      // console.log(payload);
      state.messages.push(payload);
    },
    removeMessages: (state, { payload }) => {
      // console.log(payload);
      state.messages = state.messages
        .filter((message) => message.currentChannelId !== payload);
      // state.channels = state.channels.filter((item) => item.id !== payload);
    },
  },
});

export const { setMessages, addMessage, removeMessages } = sliceMessages.actions;

export default sliceMessages.reducer;
