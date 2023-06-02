import axios from 'axios';
import React, { useEffect, useState } from 'react';
// import routes from '../routes.js';

// const getAuthHeader = () => {
//   const usetId = localStorage.getItem('userId');
//   const userId = JSON.parse(usetId);

//   if (userId && userId.token) {
//     return { Authorization: `Bearer ${userId.token}` };
//   }

//   return {};
// };
// const checkTocken = () => {
//   const userId = window.localStorage.getItem('userId');
//   if (userId) {
//     return JSON.parse(userId).token;
//   }
//   return '';
// };

const Chat = () => {
  const [token, setToken] = useState('');
  // useEffect(() => {
  //   const fetchContent = async () => {
  //     const newToken = await checkTocken();
  //     setToken(newToken);
  //   };
  //   fetchContent();
  // }, [token]);

  return <p>I did it!</p>;
};

export default Chat;
