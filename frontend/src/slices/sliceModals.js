/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  modalInfo: {},
};

const sliceModals = createSlice({
  name: 'sliceModals',
  initialState,
  reducers: {
    setModalInfo: (state, { payload }) => {
      // console.log(payload);
      state.modalInfo = payload;
    },
  },
});

export const { setModalInfo } = sliceModals.actions;

export default sliceModals.reducer;
