/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  modalInfo: { type: '', selectedChannel: null },
};

const sliceModals = createSlice({
  name: 'sliceModals',
  initialState,
  reducers: {
    openModal: (state, { payload }) => {
      // console.log(payload);
      state.modalInfo = payload;
    },
    closeModal: (state) => {
      // console.log(payload);
      state.modalInfo = { type: '', selectedChannel: null };
    },
  },
});

export const { openModal, closeModal } = sliceModals.actions;

export default sliceModals.reducer;
