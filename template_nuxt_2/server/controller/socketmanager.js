const ApiList = require('../common/socket_api.js');
const Constant = require('../../constant');
const request = require('request');
const Promise = require('bluebird');
let fs = require('fs-extra');
fs = Promise.promisifyAll(fs);

const debug = require('debug')(Constant.debug_name + ':socket');
const ErrorCode = require('../common/error_code');
const UploadImp = require('./ImageController');

const UserModel = require('../database/User');
const LoginModel = require('../database/Login');
const SettingModel = require('../database/Setting');
const socketResult = 'socket_result';

const __ = key => ErrorCode[key];

const UserRoles = UserModel.getUserRole();

debug('init socket');

class ChatController {
  constructor() {
    let self = this;
    this.users = {};
    this.fcmTokens = {};
    this.socketsOfUser = {};
    this.io = require('socket.io')();
    this.nspApi = this.io.of('api');
    this.nspAdmin = this.io.of('admin');
    function respUnauthenticate(error, next) {
      let err = new Error(ErrorCode.authenticateRequired);
      err.data = { type: 'authentication_error', detail: error };
      debug('check login fail', JSON.stringify(err));
      return next(err);
    }

    function init() {
      return new Promise(async (resolve, reject) => {
        let logins = await LoginModel.aggregate([
          {
            $group: {
              _id: '$user',
              items: { $addToSet: '$fcmToken' },
            },
          },
        ]);
        resolve(logins);
      });
    }

    init()
      .then(logins => {
        logins.forEach(login => {
          this.fcmTokens[login._id.toString()] = login.items;
        });
        // debug('fcmTokens',this.fcmTokens);
      })
      .then(() => {
        debug('init namespace root');
        this.nspApi.use(async function(socket, next) {
          let token = socket.handshake.query.token;
          let hl = socket.handshake.query.hl || 'en';
          debug('get token', token);
          if (!token) return respUnauthenticate('Token required', next);
          try {
            let user = await self.checkLogin(socket, token);

            LoginModel.updateOne({ token }, { $set: { hl } }).exec();

            let userId = user._id.toString();
            socket.user = user;
            socket.join(userId);

            if (
              !self.socketsOfUser[userId] ||
              self.socketsOfUser[userId].length == 0
            ) {
              self.socketsOfUser[userId] = [socket.id];
            } else if (!self.socketsOfUser[userId].includes(socket.id)) {
              self.socketsOfUser[userId].push(socket.id);
            }

            if (!self.users[userId]) self.users[userId] = [];
            next();
          } catch (e) {
            respUnauthenticate(e, next);
          }
        });

        this.nspAdmin.use(async function(socket, next) {
          let token = socket.handshake.query.token;

          let error = 'token missing';

          try {
            if (token) {
              await self.checkRole(socket, { token }, UserRoles.Admin);
              return next();
            }
          } catch (e) {
            error = e;
          }
          respUnauthenticate(error, next);
        });

        debug('add socket handler');
        this.addSocketHandler();
        debug('init socket finish');
      })
      .catch(e => {
        debug('init socket error ' + JSON.stringify(e));
      })
      .bind(this);
  }

  userStatusOnline(user, status, nsp) {
    // let userId = user.id;
    // let rooms = this.users[userId] || [];
    // debug(rooms);
    // rooms.forEach((room) => {
    //   this.ioEmitTo(room, ApiList.event_user_status, null, this.getUserStatus(room, user, status), nsp);
    // })
  }

  getServerDateTime(socket, key) {
    this._emitData(socket, this.getKeyEvent(key, 0), 1, new Date());
  }

  sendNotification(
    registrationIds,
    dataMess,
    title,
    text,
    collapseKey,
    callback,
  ) {
    callback = callback || function() {};

    if (!registrationIds) return callback(new Error('token null'));
    if (typeof registrationIds === 'string') {
      registrationIds = [registrationIds];
    } else if (!Array.isArray(registrationIds)) {
      return callback(new Error('token must be string or string[]'));
    }

    let dataStructor = {
      registration_ids: [],
      notification: {
        title,
        body: text,
        sound: 'default',
        vibrate: 2,
        // "vibrationPattern": [1000, 1000],
        icon: 'fcm_push_icon',
      },
      priority: 'high',
      collapse_key: collapseKey,
      data: dataMess,
    };

    let options = {
      method: 'POST',
      url: 'https://fcm.googleapis.com/fcm/send',
      headers: {
        'content-type': ' application/json',
        authorization: 'key=' + Constant.FCM_KEY,
      },
      json: dataStructor,
    };
    const chunk = 1000;
    debug('send notification', options.json.data);
    for (let i = 0, j = registrationIds.length; i < j; i += chunk) {
      let temparray = registrationIds.slice(i, i + chunk);
      // do whatever
      options.json.registration_ids = temparray;
      request(options, (err, response, body) => {
        debug('notification', err || 'success');
        if (err) return callback(err);
        callback(null, {
          url: body.url,
          status: response.statusCode,
          body,
        });
      });
    }
  }

  addSocketHandler() {
    if (typeof this.io === 'undefined') {
      debug('io undefined');
      return;
    }
    let that = this;

    this.io.on('connection', function(socket) {
      socket.on(ApiList.change_password, function(info) {
        UserModel.changePassword(
          this.user && this.user._id,
          info,
          that.response(this, ApiList.change_password),
        );
      });
    });

    this.nspApi.on('connection', function(socket) {
      debug('socket connection');

      socket.on(ApiList.logout, function() {
        let userId = this.user.id.toString();
        that.userStatusOnline(this.user, false, that.nspApi);
        // socket.leaveAll()
        let index = that.socketsOfUser[userId].indexOf(this.id);
        if (index > -1) that.socketsOfUser[userId].splice(index, 1);
        socket.disconnect(true);
      });

      /**
       * User API
       */
      socket.on(ApiList.get_user_by_id, function() {
        UserModel.getUserInfo(
          this.user._id,
          that.response(this, ApiList.get_user_by_id),
        );
      });

      socket.on(ApiList.edit_user, function(info) {
        info = info || {};
        info._id = this.user._id;
        UserModel.updateUserInfoBySelf(
          info,
          that.response(this, ApiList.edit_user),
        );
      });

      socket.on(ApiList.change_password, function(info) {
        UserModel.changePassword(
          this.user._id,
          info,
          that.response(this, ApiList.change_password),
        );
      });

      /**
       * End USER API
       */

      socket.on('disconnect', function(reason) {
        debug('socket disconnect ' + reason);
        let userId = this.user.id.toString();

        let userSockets = that.socketsOfUser[userId];
        if (userSockets && Array.isArray(userSockets)) {
          let index = userSockets.indexOf(this.id);
          if (index != -1) {
            userSockets.splice(index, 1);
          }

          debug(userSockets);
          if (userSockets.length == 0) {
            // push to clients
            that.userStatusOnline(this.user, false, that.nspApi);
          }
        }
      });
    });

    /**
     * ADMIN API
     */

    this.nspAdmin.on('connection', function(socketAd) {
      socketAd.on('disconnect', reason => {
        debug('sk admin disconnect', reason);
      });

      socketAd.on(ApiList.get_list_user, function(info) {
        UserModel.getUserListByCondition(
          info,
          that.response(this, ApiList.get_list_user),
        );
      });

      socketAd.on(ApiList.delete_user, function(info) {
        UserModel.deleteUser(
          info._id,
          that.response(this, ApiList.delete_user),
        );
      });

      socketAd.on(ApiList.get_user_by_id, function(info) {
        UserModel.getUserInfo(
          info._id,
          that.response(this, ApiList.get_user_by_id),
        );
      });

      socketAd.on(ApiList.edit_user, function(info) {
        UserModel.updateUserInfo(
          info.new_info,
          that.response(this, ApiList.edit_user),
        ).then(user => {
          if (user && user._doc.roleChanged) {
            that.ioEmitTo(
              user._id.toString(),
              ApiList.user_changed_role,
              null,
              user,
              that.nspApi,
            );
          }
        });
      });

      socketAd.on(ApiList.add_user, function(info) {
        UserModel.createUserWithEmail(
          info.new_info,
          that.response(this, ApiList.add_user),
        );
      });

      socketAd.on(ApiList.update_user_password, function(info) {
        UserModel.forceChangePassword(
          info,
          that.response(this, ApiList.update_user_password),
        ).then(user => {
          that.logoutAll(user);
        });
      });

      // socketAd.on(ApiList.add_user, function (info) {
      //   UserModel.createUserWithEmail(info, that.response(this, ApiList.add_user));
      // })

      socketAd.on(ApiList.get_user_role, function() {
        that.response(
          this,
          ApiList.get_user_role,
        )(null, UserModel.getUserRole());
      });

      socketAd.on('disconnect', reason => {
        debug('socket admin disconnect ', reason);
      });
    });
  }

  emitNewUser() {
    UserModel.getUserListByCondition(
      {
        page: 1,
        limit: 10,
        filter: { role: [2, 3] },
        sort: { registerDate: -1 },
      },
      this.responseOnChannel(ApiList.get_list_user, this.nspAdmin),
    );
  }

  logoutAll(user) {
    let userId = user.id.toString();
    this.userStatusOnline(user, false);
    this.fcmTokens[userId] = [];
    this.ioEmitTo(userId, ApiList.user_changed_password, false, {
      changed: true,
    });
  }

  logoutSocket(socketId) {
    this.io.sockets.connected[socketId] &&
      this.io.sockets.connected[socketId].disconnect(true);
  }

  logout(user, fcmToken) {
    let userId = user.id.toString();
    this.userStatusOnline(user, false);

    let index = this.fcmTokens[userId].indexOf(fcmToken);
    if (this.fcmTokens[userId].includes(fcmToken))
      this.fcmTokens[userId].splice(index, 1);
  }

  addFcmToken(userId, fcmToken) {
    userId = userId.toString();
    if (!this.fcmTokens[userId]) this.fcmTokens[userId] = [];
    if (!this.fcmTokens[userId].includes(fcmToken))
      this.fcmTokens[userId].push(fcmToken);
  }

  _saveImage(folder, src, type) {
    if (type == 'buffer') {
      return this._saveBufferImage(folder, src);
    }
    return this._saveBase64Image(folder, src);
  }

  _saveBufferImage(folder, buffer, cb) {
    if (typeof buffer === 'string') return buffer;
    let extension = '.jpg';
    let pathImg = Constant.uploads_folder + '/' + folder;
    let nameImg = 'file-' + new Date().getTime() + extension;
    pathImg = UploadImp.createFolder(pathImg) + '/' + nameImg;
    return fs
      .writeFileAsync(pathImg, buffer, 'Binary')
      .return(folder + '/' + nameImg)
      .catch(err => {
        fs.removeSync(pathImg);
        return Promise.reject(err);
      })
      .asCallback(cb);
  }

  _saveBase64Image(folder, imgSrc, cb) {
    let rule = /^data:image\/([a-zA-z]{3,4});base64,/;
    if (!rule.test(imgSrc)) return imgSrc;
    let extension = '.jpg';
    let img = imgSrc.replace(rule, '');
    let pathImg = Constant.uploads_folder + '/' + folder;
    let nameImg = 'file-' + new Date().getTime() + extension;
    pathImg = UploadImp.createFolder(pathImg) + '/' + nameImg;
    // save image
    return fs
      .writeFileAsync(pathImg, img, 'base64')
      .return(folder + '/' + nameImg)
      .catch(err => {
        fs.removeSync(pathImg);
        return Promise.reject(err);
      })
      .asCallback(cb);
  }

  getUserStatus(eventId, user, online) {
    user = user || {};
    return { event: eventId, user, online };
  }

  response(socket, key) {
    let self = this;
    return function(error, info) {
      self._emitData(socket, self.getKeyEvent(key), !error, error || info);
    };
  }
  responseTo(key, room, nsp) {
    let self = this;
    return function(error, info) {
      self.ioEmitTo(
        room,
        self.getKeyEvent(key),
        error,
        info,
        nsp || self.nspApi,
      );
    };
  }

  responseOnChannel(key, nsp) {
    key = this.getKeyEvent(key);
    return function(error, data) {
      if (nsp)
        nsp.emit(socketResult, {
          key,
          success: !error,
          data: data || error,
        });
    };
  }

  ioEmit(key, data, nsp) {
    if (nsp) nsp.emit(socketResult, { key, success: true, data });
    this.io.emit(socketResult, { key, success: true, data });
  }

  ioEmitTo(room, key, error, info, nsp) {
    // debug('key ' + key + ' success ' + JSON.stringify(error) + ' info ' + JSON.stringify(info));
    if (nsp) {
      return nsp
        .to(room.toString())
        .emit(socketResult, { key, success: !error, data: error || info });
    }
    this.io
      .to(room.toString())
      .emit(socketResult, { key, success: !error, data: error || info });
  }

  _emitData(socket, key, success, info) {
    if (typeof info === 'undefined') {
      info = success;
    }
    // debug('key ' + key + ' success ' + success + ' info ' + JSON.stringify(info));
    socket.emit(socketResult, { key, success, data: info });
  }

  getDefaultObject(success, info) {
    return { success, data: info };
  }

  checkLogin(socket, token, callback) {
    debug('check login ' + token);
    let self = this;
    return new Promise(async (resolve, reject) => {
      try {
        let login = await LoginModel.checkToken(token);
        resolve(login.user);
      } catch (error) {
        if (error) {
          if (error == -1) {
            self._emitData(socket, 'login_error', 0, __('UserPermissionDeny'));
            return reject(__('UserPermissionDeny'));
          } else if (error == 1) {
            self._emitData(socket, 'login_error', 0, __('UserPermissionDeny'));
            return reject(__('UserPermissionDeny'));
          } else if (error == 2) {
            self._emitData(socket, 'login_error', 0, __('UserBanned'));
            return reject(__('UserBanned'));
          } else {
            self._emitData(socket, 'login_error', 0, error.toString());
            return reject(error.toString());
          }
        }

        self._emitData(socket, 'login_error', 0, __('ErrorUnknown'));
        reject(new Error('Unknown error'));
      }
    }).asCallback(callback);
  }

  getKeyEvent(key, status) {
    if (typeof status === 'undefined') {
      return key;
    }
    key = 'user_' + key;
    if (status === 1) {
      return key + '_success';
    } else {
      return key + '_failed';
    }
  }

  checkRole(socket, info, role, callback) {
    let self = this;
    return new Promise((resolve, reject) => {
      if (!info) {
        self._emitData(socket, socketResult, __('MissingParams'));
        return reject(__('MissingParams'));
      }
      info = info || {};
      if (socket.user) {
        if (socket.user.role >= role) {
          socket.join(socket.user._id.toString());
          return resolve(info);
        }
        self._emitData(socket, socketResult, __('AccessDenied'));
        return reject(__('AccessDenied'));
      }
      self.checkLogin(socket, info.token, function(err, user) {
        if (err) {
          return reject(err);
        }
        if (user.role >= role) {
          let userId = user._id.toString();
          socket.user = user;
          socket.join(userId);
          resolve(info);
        } else {
          self._emitData(socket, socketResult, __('AccessDenied'));
          return reject(__('AccessDenied'));
        }
      });
    }).asCallback(callback);
  }
}

let EventEmitter = require('events').EventEmitter;
let util = require('util');
util.inherits(ChatController, EventEmitter);

const instance = new ChatController();
Object.freeze(instance);
module.exports = instance;
