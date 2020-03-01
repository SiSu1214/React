import Vue from 'vue';
import VueSocketIO from 'vue-socket.io';
import socketio from 'socket.io-client';
let constant = require('../constant');
export default {
  connect: (token, channel) => {
    const SocketInstance = socketio(constant.base_url + (channel || ''), {
      transports: ['websocket'],
      extraHeaders: {
        Authorization: token,
      },
      query: 'token=' + (token || null),
    });
    if (process.browser) {
      Vue.use(
        new VueSocketIO({
          debug: true,
          connection: SocketInstance,
        }),
      );
    }
  },
};
