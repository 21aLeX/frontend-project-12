import React, { useEffect, useState } from 'react';
import { Modal, FormGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { removeChannel, setCurrentChannelId } from '../slices/slice';

const socket = io('ws://localhost:5001');
const generateOnSubmit = ({ onHide }, { id }, setStatusButton) => (e) => {
  e.preventDefault();
  setStatusButton(true);
  socket.emit('removeChannel', { id });
  setStatusButton(false);
  onHide();
};

const Remove = (props) => {
  const [statusButton, setStatusButton] = useState(false);
  const { modalInfo: { item } } = props;
  const dataChat = useSelector((state) => state.data.data);
  const { onHide } = props;
  const dispatch = useDispatch();
  const onSubmit = generateOnSubmit(props, item, setStatusButton);
  useEffect(() => {
    socket.off('removeChannel');
    socket.on('removeChannel', (channel) => {
      dispatch(removeChannel(channel.id));
      if (channel.id === dataChat.currentChannelId) {
        dispatch(setCurrentChannelId(1));
      }
    });
  });
  return (
    <Modal show centered onHide={onHide}>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>Удалить канал</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p className="lead">Уверены?</p>
        <form onSubmit={onSubmit}>
          <FormGroup>
            <div className="d-flex justify-content-end mt-2">
              <button onClick={onHide} type="button" className="btn btn-secondary me-2" data-dismiss="modal">Отменить</button>
              <input disabled={statusButton} type="submit" className="btn btn-danger" value="Удалить" />
            </div>
          </FormGroup>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default Remove;
