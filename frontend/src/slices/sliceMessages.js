/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { removeChannel } from './sliceChannels.js';
import fetchData from '../Api/fetchData.js';

const initialState = {
  messages: [],
};

const sliceMessages = createSlice({
  name: 'sliceMessages',
  initialState,
  reducers: {
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
  extraReducers: (builder) => {
    builder
      .addCase(removeChannel, (state, { payload }) => {
        // console.log(current(state));
        state.messages = state.messages
          .filter((message) => message.channelId !== payload);
        // console.log(current(state));
      })
      .addCase(fetchData.fulfilled, (state, { payload }) => {
        state.messages = payload.messages;
      });
  },
});

export const { setMessages, addMessage, removeMessages } = sliceMessages.actions;

export default sliceMessages.reducer;
