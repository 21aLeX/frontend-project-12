import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import routes from '../routes.js';

const fetchData = createAsyncThunk(
  'fetchData',
  async (headers) => {
    try {
      const { data: { messages, currentChannelId, channels } } = await axios
        .get(routes.usersPath(), { headers });
      // console.log(messages);
      return { messages, currentChannelId, channels };
    } catch (error) {
      return error;
    }
  },
);

export default fetchData;
