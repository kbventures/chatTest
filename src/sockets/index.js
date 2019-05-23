import * as types from '../constants/ActionTypes';
import { addUser, messageReceived, populateUsersList } from '../actions';

const setupSocket = (dispatch, username) => {
  const socket = new WebSocket('ws://sheltered-refuge-60413.herokuapp.com');
  //const socket = new WebSocket('wss://boiling-brook-76849.herokuapp.com');
  //const HOST = location.origin.replace(/^http/, 'ws');
  //const socket = new WebSocket(HOST);

  socket.onopen = () => {
    socket.send(
      JSON.stringify({
        type: types.ADD_USER,
        name: username
      })
    );
  };
  socket.onmessage = event => {
    const data = JSON.parse(event.data);
    switch (data.type) {
      case types.ADD_MESSAGE:
        dispatch(messageReceived(data.message, data.author));
        break;
      case types.ADD_USER:
        dispatch(addUser(data.name));
        break;
      case types.USERS_LIST:
        dispatch(populateUsersList(data.users));
        break;
      default:
        break;
    }
  };
  return socket;
};

export default setupSocket;
