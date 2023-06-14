/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

// Начальное значение
const initialState = {
  data: {
    channels: [{ name: '', id: 1 }],
    messages: [],
    currentChannelId: 1,
    username: '',
  },
};

const slice = createSlice({
  name: 'slice',
  initialState,
  // Редьюсеры в слайсах мутируют состояние и ничего не возвращают наружу
  reducers: {
    setData: (state, { payload }) => {
      console.log(payload);
      state.data = payload;
    },
    setCurrentChannelId: (state, { payload }) => {
      // console.log(payload);
      state.data.currentChannelId = payload;
    },
    setUser: (state, { payload }) => {
      console.log(payload);
      state.data.username = payload;
    },
    addMessage: (state, { payload }) => {
      // console.log(payload);
      state.data.messages.push(payload);
    },
    addChannel: (state, { payload }) => {
      // console.log(payload);
      state.data.channels.push(payload);
    },
    removeChannel: (state, { payload }) => {
      // console.log(payload);
      state.data.messages = state.data.messages
        .filter((message) => message.currentChannelId !== payload);
      state.data.channels = state.data.channels.filter((item) => item.id !== payload);
    },
    renameChannel: (state, { payload }) => {
      // console.log(payload);
      // state.data.messages = state.data.messages
      //   .filter((message) => message.currentChannelId !== payload);
      state.data.channels = state.data.channels.map((item) => {
        if (item.id === payload.id) {
          return { ...item, name: payload.name };
        }
        return item;
      });
    },
    // decrement: (state) => {
    //   state.value -= 1;
    // },
    // // пример с данными
    // incrementByAmount: (state, action) => {
    //   state.value += action.payload;
    // },
  },
});

// Слайс генерирует действия, которые экспортируются отдельно
// Действия генерируются автоматически из имен ключей редьюсеров
export const {
  setData, addMessage, setCurrentChannelId, addChannel, setUser, removeChannel, renameChannel,
} = slice.actions;

// По умолчанию экспортируется редьюсер, сгенерированный слайсом
export default slice.reducer;
