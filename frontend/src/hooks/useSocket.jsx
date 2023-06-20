import { useContext } from 'react';

import socketContext from '../contexts/SocketContext.jsx';

const useSocket = () => useContext(socketContext);

export default useSocket;
