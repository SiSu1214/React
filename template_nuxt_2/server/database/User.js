const Promise = require('bluebird');
let mongoose = require('mongoose');
mongoose.Promise = Promise;
let Schema = mongoose.Schema;
let Utility = require('../common/utility');
let Constant = require('../../constant');
const debug = require('debug')(Constant.debug_name + ':UserModel');
const ErrorCode = require('../common/error_code');
const path = require('path');
const jwt = require('jsonwebtoken');
const imgControl = require('../controller/ImageController');
const regexEmail = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,})?$/;
const plugin = require('../common/mongoose_plugin');
let LocationSchema = {
  zipcode: String,
  code: String,
  city: String,
  country: String,
  address: String,
  lat: Number,
  lng: Number,
};

let oldPasswordSchema = {
  password: String,
  timeChange: { type: Date, default: Date.now },
};

let UserSchema = new Schema(
  {
    facebookId: { type: Number },
    facebookName: { type: String },
    googleId: String,
    username: { type: String, lowercase: true, trim: true },
    fullName: String,
    firstName: String,
    lastName: String,
    birthDate: Date,
    registerDate: { type: Date, default: Date.now },
    gender: { type: Number, default: 0 },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      validate: {
        validator(v) {
          return regexEmail.test(v);
        },
        message: ErrorCode.invalidEmail,
      },
      required: [regexEmail, ErrorCode.invalidEmail],
    },
    password: { type: String },
    pwdForgot: { type: String },
    oldPassword: [oldPasswordSchema],
    avatar: { type: String },
    profilePicture: [String],
    about: { type: String, default: '' },
    phoneNumber: { type: String },
    age: Number,
    location: LocationSchema,
    isActive: Number,
    status: { type: String },
    isUpdateFirstTimeProfile: { type: Boolean, default: true },
    role: { type: Number, default: 2 },
    expiredAt: { type: Date, default: null },
    balance: { type: Number, default: 0 },
    company: String,
  },
  { usePushEach: true },
);

UserSchema.plugin(plugin);

UserSchema.virtual('noNeedOldPwd').get(() => {
  return !!this.googleId && !this.password;
});

let PublicFields = [
  'username',
  'fullName',
  'facebookId',
  'facebookName',
  'company',
  'location',
  'firstName',
  'lastName',
  'birthDate',
  'registerDate',
  'gender',
  'email',
  'avatar',
  'profilePicture',
  'about',
  'phoneNumber',
  'age',
  'isActive',
  'role',
  'status',
  'balance',
];
let UserRole = {
  Super_Admin: 999,
  Admin: 998,
  Moderator: 4,
  Driver: 3,
  Member: 2,
  Banned: 1,
};

class UserModel extends mongoose.Model {
  static getPublicFields() {
    return PublicFields;
  }

  static getPublicSelect() {
    return PublicFields.join(' ');
  }

  static getUserRole() {
    return UserRole;
  }
  static getMerchantByEmail(email, callback) {
    return this.findOne({ email, role: UserRole.Driver }).exec(callback);
  }

  static async createUserWithEmail(info, callback) {
    if (
      typeof info === 'undefined' ||
      typeof info.email === 'undefined' ||
      typeof info.password === 'undefined'
    ) {
      return Promise.reject(ErrorCode.MissingParams(info)).asCallback(callback);
    }

    // if (info.id || info._id) {
    //   info._id = info._id || info.id
    //   let valid = await this.isObjectId(info.id)
    //   if (!valid) delete info._id
    // } else {

    // }
    delete info._id;
    delete info.id;

    if (!info.password || info.password.length < 6) {
      return Promise.reject(ErrorCode.invalidPassword).asCallback(callback);
    }

    if (!info.email || !regexEmail.test(info.email)) {
      return Promise.reject(ErrorCode.invalidEmail).asCallback(callback);
    }

    delete info.username;
    return this.findOne({ email: info.email.toLowerCase().trim() })
      .then(checkUser => {
        if (checkUser == null) {
          // create user
          info.password = Utility.createPassword(info.password);
          return this.create(info);
        } else {
          return Promise.reject(ErrorCode.emailInUse);
        }
      })
      .asCallback(callback);
  }

  static createUserWithGoole(info, callback) {
    if (
      !info ||
      !info.googleId ||
      !info.email ||
      !info.lastName ||
      !info.firstName
    )
      return Promise.reject(ErrorCode.MissingParams(info)).asCallback(callback);
    if (!info.email || !/^([\w-\.]+@([\w-]+\.)+[\w-]{2,})?$/.test(info.email)) {
      return Promise.reject(ErrorCode.invalidEmail).asCallback(callback);
    }
    delete info.username;
    return this.findOne({ googleId: info.googleId })
      .then(user => {
        if (user == null) {
          return this.create(info);
        } else {
          if (user.role == UserRole.Banned)
            return Promise.reject(ErrorCode.userBanned);
          return user;
        }
      })
      .asCallback(callback);
  }

  static getUserInfo(id, callback) {
    return this.findById(id, PublicFields, callback);
  }

  static getUserListByCondition(data, callback) {
    let options = {};
    options.sort = data.sort || { registerDate: -1 };
    if (data.limit != undefined) options.limit = Number(data.limit);
    if (data.page != undefined) options.page = Number(data.page);
    let filter = {};
    if (data.filter && Object.keys(data.filter).length > 0) {
      let fArr = [];
      Object.keys(data.filter).forEach(function(value) {
        if (UserSchema.paths[value]) {
          let f = {};
          if (Array.isArray(data.filter[value])) {
            if (data.filter[value].length > 0)
              f[value] = { $in: data.filter[value] };
          } else {
            f[value] = new RegExp(data.filter[value], 'ig');
          }

          if (Object.keys(f).length) fArr.push(f);
        }
      });
      if (fArr.length > 0) filter.$and = fArr;
    }
    if (data.search && typeof data.search === 'string') {
      if (!filter.$and) filter.$and = [];
      filter.$and.push({
        $or: [
          { facebookName: { $regex: data.search, $options: 'i' } },
          { fullName: { $regex: data.search, $options: 'i' } },
          { firstName: { $regex: data.search, $options: 'i' } },
          { lastName: { $regex: data.search, $options: 'i' } },
          { phoneNumber: { $regex: data.search, $options: 'i' } },
          { email: { $regex: data.search, $options: 'i' } },
          { about: { $regex: data.search, $options: 'i' } },
          { username: { $regex: data.search, $options: 'i' } },
        ],
      });
      debug(filter.$and);
    }
    options.select = PublicFields;
    return this.paginate(filter, options, callback);
  }

  static getUserInfoByList(userIds, callback) {
    return this.find({ _id: { $in: userIds } }, PublicFields, callback);
  }

  static updateUserInfoBySelf(info, callback) {
    return this.updateUserInfo(info, callback);
  }

  static async updateUserInfo(newInfo, callback) {
    if (!newInfo || !newInfo._id)
      return Promise.reject(ErrorCode.MissingParams(newInfo)).asCallback(
        callback,
      );
    let roleChanged = false;
    delete newInfo.password;
    return this.findById(newInfo._id)
      .then(oldUser => {
        if (!oldUser) return Promise.reject(ErrorCode.userNotFound);

        let promise = Promise.resolve(false);
        if (newInfo.avatar && /^tmp/i.test(newInfo.avatar)) {
          let oldPath = Constant.uploads_folder + newInfo.avatar;
          // var newPath = Constant.uploads_folder + newInfo._id + '/' + newInfo.avatar.split('/')[1];
          oldPath = path.normalize(oldPath);
          promise = imgControl.move(
            oldPath,
            Constant.uploads_folder,
            newInfo._id.toString() + '/' + Date.now() + '.jpg',
          );
        }
        roleChanged = newInfo.role != undefined && oldUser.role != newInfo.role;
        return promise;
      })
      .then(pathImg => {
        if (pathImg) newInfo.avatar = pathImg;
        return this.findByIdAndUpdate(
          newInfo._id,
          { $set: newInfo },
          { new: true },
        ).then(async user => {
          user._doc.roleChanged = roleChanged;
          return user;
        });
      })
      .asCallback(callback);
  }

  static changePassword(userId, passInfo, callback) {
    // if (!passInfo.password_old) return Promise.reject(ErrorCode.passwordIncorrect).asCallback(callback);
    if (!passInfo.password_new)
      return Promise.reject(ErrorCode.passwordNewRequired).asCallback(callback);
    if (!userId)
      return Promise.reject(ErrorCode.userNotFound).asCallback(callback);
    return this.findById(userId)
      .then(user => {
        if (!user) return Promise.reject(ErrorCode.userNotFound);
        if (user.noNeedOldPwd) {
          user.password = Utility.createPassword(passInfo.password_new);
        } else {
          if (!passInfo.password_old)
            return Promise.reject(ErrorCode.currentPasswordNotMatch).asCallback(
              callback,
            );
          passInfo.password_old = Utility.createPassword(passInfo.password_old);
          if (passInfo.password_old != user.password) {
            return Promise.reject(ErrorCode.passwordIncorrect);
          }
          user.oldPassword.push({ password: passInfo.password_old });
          user.password = Utility.createPassword(passInfo.password_new);
        }
        return user.save();
      })
      .asCallback(callback);
  }

  static deleteUser(userId, callback) {
    return this.findByIdAndUpdate(userId, { $set: { role: UserRole.Banned } })
      .exec()
      .asCallback(callback);
  }

  static forceChangePassword(info, callback) {
    if (!info.new_password)
      return Promise.reject(ErrorCode.PasswordNewMissing).asCallback(callback);
    return this.findById(info._id)
      .then(async user => {
        if (!user) return Promise.reject(ErrorCode.userNotFound);

        user.oldPassword.push({ password: user.password });
        user.password = Utility.createPassword(info.new_password);

        // clear all session of user
        // let logins = await mongoose
        //   .model('LoginModel')
        //   .find({ user: user._id.toString(), isExpired: 0 })
        //   .exec()
        //   .map(l => {
        //     return { session: new RegExp(l._id.toString(), 'ig') }
        //   })

        // let dbSessions = mongoose.connection.collection('sessions')
        // dbSessions.find({ $or: logins }).forEach(s => {
        //   try {
        //     let session = JSON.parse(s.session)
        //     session.passport = {}
        //     s.session = JSON.stringify(session)
        //     dbSessions.updateOne({ _id: s._id }, { $set: s })
        //   } catch (error) {}
        // })

        return user.save();
      })
      .asCallback(callback);
  }

  static resetPassword(token, newPwd, callback) {
    return this.checkTokenChangePwd(token)
      .then(user => {
        user.oldPassword.push({ password: user.password });
        user.password = Utility.createPassword(newPwd);
        user.pwdForgot = null;
        return user.save();
      })
      .asCallback(callback);
  }

  static checkTokenChangePwd(token, callback) {
    return new Promise((resolve, reject) => {
      let payload = jwt.verify(token, Constant.SecrectKey);
      if (!payload) return reject(ErrorCode.forgotPwdTokenInvalid);
      if (payload.time < new Date().getTime())
        return reject(ErrorCode.forgotPwdTokenExpired);
      UserModel.findById(payload.user)
        .exec()
        .then(user => {
          if (user && user.pwdForgot == token) return resolve(user);
          reject(ErrorCode.forgotPwdChanged);
        })
        .catch(err => {
          reject(err);
        });
    }).asCallback(callback);
  }
}

mongoose.model(UserModel, UserSchema);
module.exports = UserModel;
