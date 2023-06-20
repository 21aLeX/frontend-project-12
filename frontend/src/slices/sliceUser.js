/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  username: '',
};

const sliceUser = createSlice({
  name: 'sliceUser',
  initialState,
  reducers: {
    setUser: (state, { payload }) => {
      console.log(payload);
      state.username = payload;
    },
  },
});

export const { setUser } = sliceUser.actions;

export default sliceUser.reducer;
