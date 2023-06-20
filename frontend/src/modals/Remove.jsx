import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { removeChannel, setCurrentChannelId } from '../slices/sliceChannels.js';
import { removeMessages } from '../slices/sliceMessages.js';
import useSocket from '../hooks/useSocket.jsx';
import useRoll from '../hooks/useRoll.jsx';

const generateOnSubmit = ({ onHide }, { id }, setStatusButton, t, rollbar, socket) => async (e) => {
  e.preventDefault();
  setStatusButton(true);
  await socket.emit('removeChannel', { id }, ({ status: s }) => {
    if (s !== 'ok') {
      toast.error(t('notifications.networkError'));
      rollbar.errors('Error network remove message', s);
    }
  });
  setStatusButton(false);
  onHide();
};

const Remove = (props) => {
  const rollbar = useRoll();
  const [statusButton, setStatusButton] = useState(false);
  const { modalInfo: { item } } = props;
  const { t } = useTranslation();
  const socket = useSocket();
  const dataChat = useSelector((state) => state.data);
  const { channels: { currentChannelId } } = dataChat;
  const { onHide } = props;
  const dispatch = useDispatch();
  const onClick = generateOnSubmit(props, item, setStatusButton, t, rollbar, socket);
  useEffect(() => {
    try {
      socket.off('removeChannel');
      socket.on('removeChannel', (channel) => {
        toast.success(t('notifications.channelDeleted'));
        dispatch(removeChannel(channel.id));
        dispatch(removeMessages(channel.id));
        if (channel.id === currentChannelId) {
          dispatch(setCurrentChannelId(1));
        }
      });
    } catch (error) {
      rollbar.errors('Error remove message', error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Modal show centered onHide={onHide}>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>
          {t('interface.deleteChannel')}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p className="lead">
          {t('interface.sure')}
        </p>
        <div className="d-flex justify-content-end">
          <button onClick={onHide} type="button" className="btn btn-secondary me-2">
            {t('interface.cancel')}
          </button>
          <button disabled={statusButton} onClick={onClick} type="submit" className="btn btn-danger">{t('interface.remove')}</button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default Remove;
