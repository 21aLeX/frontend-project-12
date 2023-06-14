import React, { useEffect } from 'react';
import { Modal, FormGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { removeChannel, setCurrentChannelId } from '../slices/slice';

const socket = io('ws://localhost:5001');
const generateOnSubmit = ({ onHide }, { id }) => (e) => {
  e.preventDefault();
  socket.emit('removeChannel', { id }, ({ status: s, data }) => {
    // console.log(s);
  });
  // setItems((items) => items.filter((i) => i.id !== modalInfo.item.id));
  onHide();
};

const Remove = (props) => {
  const { modalInfo: { item } } = props;
  const dataChat = useSelector((state) => state.data.data);
  // console.log(item);
  const { onHide } = props;
  const dispatch = useDispatch();
  const onSubmit = generateOnSubmit(props, item);
  useEffect(() => {
    socket.off('removeChannel');
    socket.on('removeChannel', (channel) => {
      // console.log(channel.id);
      dispatch(removeChannel(channel.id));
      if (channel.id === dataChat.currentChannelId) {
        dispatch(setCurrentChannelId(1));
      }
    });
  });
  return (
    <Modal show>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>Удалить канал</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p className="lead">Уверены?</p>
        <form onSubmit={onSubmit}>
          <FormGroup>
            <div className="d-flex justify-content-end mt-2">
              <button onClick={onHide} type="button" className="btn btn-secondary me-2" data-dismiss="modal">Отменить</button>
              <input type="submit" className="btn btn-danger" value="Удалить" />
            </div>
          </FormGroup>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default Remove;
// END
