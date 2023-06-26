import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import routes from '../routes.js';

const fetchData = createAsyncThunk(
  'fetchData',
  async (headers) => {
    try {
      const { data: { messages, currentChannelId, channels } } = await axios
        .get(routes.usersPath(), { headers });
      return { messages, currentChannelId, channels };
    } catch (error) {
      throw new Error(error.response.status);
    }
  },
);

export default fetchData;
