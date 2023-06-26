/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import fetchData from '../api/fetchData.js';

const initialState = {
  channels: [],
  currentChannelId: 1,
  isError: false,
  errorCode: '',
};

const sliceChannels = createSlice({
  name: 'sliceChannels',
  initialState,
  reducers: {
    setCurrentChannelId: (state, { payload }) => {
      // console.log(payload);
      state.currentChannelId = payload;
    },
    addChannel: (state, { payload }) => {
      // console.log(payload);
      state.channels.push(payload);
    },
    removeChannel: (state, { payload }) => {
      // console.log(payload);
      state.channels = state.channels.filter((item) => item.id !== payload);
    },
    renameChannel: (state, { payload }) => {
      state.channels = state.channels.map((item) => {
        if (item.id === payload.id) {
          return { ...item, name: payload.name };
        }
        return item;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.fulfilled, (state, { payload }) => {
        state.channels = payload.channels;
        state.currentChannelId = payload.currentChannelId;
      });
  },
});

export const {
  setData, setCurrentChannelId, addChannel, removeChannel, renameChannel,
} = sliceChannels.actions;

export default sliceChannels.reducer;
