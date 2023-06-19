import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';
import { useRollbar } from '@rollbar/react';
import { removeChannel, setCurrentChannelId } from '../slices/slice';

const socket = io();
// const socket = io('ws://localhost:5001');
const generateOnSubmit = ({ onHide }, { id }, setStatusButton, t, rollbar) => (e) => {
  e.preventDefault();
  setStatusButton(true);
  socket.emit('removeChannel', { id }, ({ status: s }) => {
    if (s !== 'ok') {
      toast.error(t('notifications.networkError'));
      rollbar.error('Error network remove message', s);
    }
  });
  setStatusButton(false);
  onHide();
};

const Remove = (props) => {
  const rollbar = useRollbar();
  const [statusButton, setStatusButton] = useState(false);
  const { modalInfo: { item } } = props;
  const { t } = useTranslation();
  const dataChat = useSelector((state) => state.data.data);
  const { onHide } = props;
  const dispatch = useDispatch();
  const onClick = generateOnSubmit(props, item, setStatusButton, t, rollbar);
  useEffect(() => {
    try {
      socket.off('removeChannel');
      socket.on('removeChannel', (channel) => {
        toast.success(t('notifications.channelDeleted'));
        dispatch(removeChannel(channel.id));
        if (channel.id === dataChat.currentChannelId) {
          dispatch(setCurrentChannelId(1));
        }
      });
    } catch (error) {
      rollbar.error('Error remove message', error);
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
