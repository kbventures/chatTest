/*/
const WebSocket = require('ws');

const port = process.env.PORT || 8989;

const wss = new WebSocket.Server({ port });
*/

const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const port = process.env.PORT || 8080;
const app = express();
const httpServer = http.createServer(app);
const wss = new WebSocket.Server({
  server: httpServer
});
httpServer.listen(port);

const users = [];

const broadcast = (data, ws) => {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN && client !== ws) {
      client.send(JSON.stringify(data));
    }
  });
};

wss.on('connection', ws => {
  let index;
  ws.on('message', message => {
    const data = JSON.parse(message);
    switch (data.type) {
      case 'ADD_USER': {
        index = users.length;
        users.push({ name: data.name, id: index + 1 });
        ws.send(
          JSON.stringify({
            type: 'USERS_LIST',
            users
          })
        );
        broadcast(
          {
            type: 'USERS_LIST',
            users
          },
          ws
        );
        break;
      }
      case 'ADD_MESSAGE':
        broadcast(
          {
            type: 'ADD_MESSAGE',
            message: data.message,
            author: data.author
          },
          ws
        );
        break;
      default:
        break;
    }
  });

  ws.on('close', () => {
    users.splice(index, 1);
    broadcast(
      {
        type: 'USERS_LIST',
        users
      },
      ws
    );
  });
});
