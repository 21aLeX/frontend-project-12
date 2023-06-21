/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { fetchData } from '../Components/Chat.jsx';

const initialState = {
  username: '',
};

const sliceUser = createSlice({
  name: 'sliceUser',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.fulfilled, (state, { payload }) => {
        state.username = payload.username;
      });
  },
});

export const { setUser } = sliceUser.actions;

export default sliceUser.reducer;
