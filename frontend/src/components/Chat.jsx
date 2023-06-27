import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import filter from 'leo-profanity';
import { useNavigate } from 'react-router-dom';
import { addMessage } from '../slices/sliceMessages.js';
import useAuth from '../hooks/useAuth.jsx';
import useSocket from '../hooks/useSocket.jsx';
import useRoll from '../hooks/useRoll.jsx';
import {
  addChannel, setCurrentChannelId, removeChannel, renameChannel,
} from '../slices/sliceChannels.js';
import fetchData from '../api/fetchData.js';
import ChatComponent from './ChatComponent.jsx';
import routes from '../routes.js';

const Chat = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dataChat = useSelector((state) => state.data);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const auth = useAuth();
  const { socket, sendMessage } = useSocket();
  const rollbar = useRoll();
  const { headers, username } = auth.getAuthHeader();
  const {
    channels: { currentChannelId: storeIdChannel, channels: storeChannels },
    messages: { messages: storeMessages },
  } = dataChat;
  const currectMessages = storeMessages
    .filter((item) => item.channelId === storeIdChannel);
  const count = currectMessages.length;
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      body: '',
    },
    onSubmit: async ({ body: mess }, { resetForm }) => {
      const message = filter.clean(mess);
      try {
        await sendMessage({ message, channelId: storeIdChannel, user: username });
        resetForm({ message: '' });
      } catch (error) {
        rollbar.getErrors('Error set new message', error);
        console.log(error);
      }
    },
  });
  const inputBody = useRef();
  const messageBox = useRef();
  useEffect(() => {
    socket.on('removeChannel', ({ id }) => {
      if (id === storeIdChannel) {
        dispatch(setCurrentChannelId(1));
      }
      toast.success(t('notifications.channelDeleted'));
      dispatch(removeChannel(id));
    });
    return () => {
      socket.off('removeChannel');
    };
  }, [dispatch, socket, storeIdChannel, t]);
  useEffect(() => {
    socket.on('newMessage', (messages) => {
      dispatch(addMessage(messages));
    });
    return () => {
      socket.off('newMessage');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    socket.on('newChannel', (channel) => {
      toast.success(t('notifications.channelCreated'));
      dispatch(setCurrentChannelId(channel.id));
      dispatch(addChannel(channel));
    });
    return () => {
      socket.off('newChannel');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    socket.on('renameChannel', (channel) => {
      toast.success(t('notifications.channelRenamed'));
      dispatch(renameChannel(channel));
    });
    return () => {
      socket.off('renameChannel');
    };
  }, [dispatch, socket, t]);
  useEffect(() => {
    const fetchContent = async () => {
      try {
        await dispatch(fetchData(headers)).unwrap();
        setIsLoading(true);
      } catch (error) {
        if (error.message === '401') {
          navigate(routes.login());
          auth.logOut();
        }
        console.log(error.message);
        rollbar.getErrors('Error get data', error);
        toast.error(t('notifications.networkError'));
      }
    };
    fetchContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return (
      <ChatComponent value={{
        storeChannels, storeIdChannel, count, messageBox, inputBody, currectMessages, formik,
      }}
      />
    );
  }
  return '';
};

export default Chat;
