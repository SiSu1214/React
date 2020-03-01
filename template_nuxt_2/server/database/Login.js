const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const plugin = require('../common/mongoose_plugin');
const constant = require('../../constant');
const UserModel = require('./User');
const UserRole = UserModel.getUserRole();
const jwt = require('jsonwebtoken');
const moment = require('moment');
const debug = require('debug')(constant.debug_name + ':login');
const ErrorCode = require('../common/error_code');

let { Model, Schema } = mongoose;

const LoginSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'UserModel' },
  token: { type: String, unique: true },
  accessToken: { type: String },
  fcmToken: { type: String },
  timeLogin: { type: Date, default: Date.now },
  deviceId: { type: String },
  lastestTimeRequest: { type: Date, default: Date.now },
  device: { type: Number },
  hl: { type: String, default: 'en' },
  isExpired: { type: Boolean, default: false },
});

LoginSchema.plugin(plugin);

class LoginModel extends Model {
  static async initSessionFromEmail(userId, loginData, callback) {
    let newSession = new this();
    newSession.user = userId;
    newSession.token = jwt.sign(newSession._id.toString(), constant.SecrectKey);
    newSession.accessToken = loginData.accessToken || '';
    newSession.fcmToken = loginData.fcmToken || '';
    newSession.device = loginData.device || 3;
    return this.create(newSession)
      .then(async data => {
        data.fcmToken && this.updateFcmToken(data._id, userId, data.fcmToken);
        await data
          .populate({
            path: 'user',
            model: 'UserModel',
            select: UserModel.getPublicSelect(),
          })
          .execPopulate();
        return data;
      })
      .asCallback(callback);
  }

  static initSession(facebookId, accessToken, fcmToken, device, callback) {
    const self = this;
    UserModel.findOne({ facebookId }, function(err, user) {
      if (err) {
        debug(err.message);
        return callback(err);
      }
      if (user) {
        // registed
        debug('registed');
        if (user.role === UserRole.Banned) {
          return callback(ErrorCode.userBanned);
        }
        self.createNewLoginSession(
          user,
          facebookId,
          accessToken,
          fcmToken,
          device,
          callback,
        );
      } else {
        // not registed
        debug('not registed');
        callback(ErrorCode.userNotFound);
      }
    });
  }

  static createNewLoginSession(
    user,
    facebookId,
    accessToken,
    fcmToken,
    device,
    callback,
  ) {
    LoginModel.findOne({ accessToken }, function(err, login) {
      if (err) {
        debug(err);
        return;
      }
      if (login) {
        // if already sign up -> login
        debug('login with old token');
        callback(null, login);
      } else {
        // if not login before
        debug('login with new token');
        const newSession = new LoginModel();
        newSession.user = user._id;
        newSession.token = jwt.sign(
          newSession._id.toString(),
          constant.SecrectKey,
        );
        newSession.accessToken = accessToken;
        newSession.fcmToken = fcmToken;
        newSession.device = device;
        newSession.save(err => {
          if (err) return callback(err);
          newSession.fcmToken &&
            this.updateFcmToken(
              newSession._id,
              newSession.user,
              newSession.fcmToken,
            );
          callback(null, newSession);
        });
      }
    });
  }

  static updateFcmToken(loginId, userId, fcmToken) {
    this.update(
      {
        _id: { $ne: loginId },
        user: { $ne: this.ObjectId(userId) },
        fcmToken,
      },
      { $set: { fcmToken: null } },
      { multi: true },
    ).exec();
  }

  static async checkToken(token, callback) {
    let check = jwt.verify(token, constant.SecrectKey);
    if (!check) return Promise.reject(-1).asCallback(callback);

    return LoginModel.findOne({ token })
      .populate({
        path: 'user',
        model: UserModel.modelName,
        select: UserModel.getPublicSelect(),
      })
      .then(login => {
        if (login) {
          if (login.user.role == UserRole.Banned) {
            return Promise.reject(2); // banned
          }

          return Promise.resolve(login);
        } else {
          return Promise.reject(1);
        }
      })
      .asCallback(callback);
  }

  static checkFbToken(token, callback) {
    LoginModel.findOne({ accessToken: token })
      .populate({
        path: 'user',
        model: UserModel.modelName,
        select: UserModel.getPublicSelect(),
      })
      .exec(function(err, login) {
        if (err) {
          return callback(0, err);
        }
        if (login) {
          callback(1, login);
        } else {
          callback(0, 'not found');
        }
      });
  }

  updateLoginTime() {
    this.lastestTimeRequest = new Date();
    this.save(function(err) {
      debug(err);
    });
  }

  getYearDiff(dateFrom) {
    if (typeof dateFrom === 'undefined') {
      dateFrom = new Date();
    }
    return moment().diff(dateFrom, 'years');
  }

  static getUserFcmToken(arrayUserId, callback) {
    LoginModel.find({ isExpired: 0, user: { $in: arrayUserId } })
      .lean()
      .distinct('fcmToken')
      .exec(function(err, fcmTokenArray) {
        if (err) {
          return callback(err);
        }
        callback(0, fcmTokenArray);
      });
  }
}
mongoose.model(LoginModel, LoginSchema);
module.exports = LoginModel;
