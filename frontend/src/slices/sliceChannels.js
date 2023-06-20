/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  channels: [{ name: '', id: 1 }],
  currentChannelId: 1,
};

const sliceChannels = createSlice({
  name: 'sliceChannels',
  initialState,
  reducers: {
    setData: (state, { payload }) => {
      console.log(payload);
      state.channels = payload.channels;
      state.currentChannelId = payload.currentChannelId;
    },
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
});

export const {
  setData, setCurrentChannelId, addChannel, removeChannel, renameChannel,
} = sliceChannels.actions;

export default sliceChannels.reducer;
