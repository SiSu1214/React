import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';

const Constant = require('../../constant');
const UserModel = require('../database/User');
const LoginModel = require('../database/Login');
const ErrorCode = require('../common/error_code');
const ApiList = require('../common/api_list');
const Utility = require('../common/utility');
const debug = require('debug')(Constant.debug_name + ':auth_session');
const socketApi = require('../controller/socketmanager.js');
const authGoogle = require('../common/google_auth');
const ImageController = require('../controller/ImageController');
const jwt = require('jsonwebtoken');
const mailCtrl = require('../controller/mail');

// Create app
const app = express();

// Install middleware
app.use(bodyParser.json());

// Session data is not stored in the cookie itself and will only be saved in the session ID. Session data is stored on the server side.
// app.use(session({
//   name: 'page-session', // The cookie key value corresponding to the session id
//   secret: 'secret', // Sign the cookie associated with the session id
//   resave: false, // Whether to resave session information each time a request is made
//   rolling: true, // Refresh the expiration time of the browser's corresponding cookie after the request
//   saveUninitialized: false, // Whether to save an uninitialized session
//   cookie: {
//     maxAge: 1000 * 60 * 5 // Set the effective time of the session, in milliseconds
//   }
// }))

// -- Routes --
// [POST] /login
app.post(ApiList.login, Utility.catchError(login));

function login(req, res) {
  let body = req.body;
  let { email, password } = body;
  // account info
  if (!email || !password)
    return Utility.generateMessage(res, ErrorCode.MissingParams(body));
  // check login
  return UserModel.findOne({ email }, function(error, user) {
    if (error) return Utility.generateMessage(res, error);
    if (user == null)
      return Utility.generateMessage(res, ErrorCode.userNotFound);
    if (user.role == UserModel.getUserRole().Banned)
      return Utility.generateMessage(res, ErrorCode.userBanned);
    if (user.password != Utility.createPassword(password))
      return Utility.generateMessage(res, ErrorCode.passwordIncorrect);
    createNewSession(req, res, user, {
      accessToken: body.accessToken,
      fcmToken: body.fcm_token,
      device: body.device,
    });
  });
}

// POST /register
app.post(ApiList.register, (req, res) => {
  let body = req.body;
  UserModel.createUserWithEmail(body)
    .then(user => {
      return createNewSession(req, res, user, {
        fcmToken: body.fcm_token,
        device: body.device,
        accessToken: body.accessToken,
      });
    })
    .catch(err => Utility.generateMessage(res, err));
});

// POST login with google info
app.post(ApiList.login_with_google_token, (req, res) => {
  let body = req.body;
  authGoogle(body.accessToken)
    .then(user => {
      return UserModel.createUserWithGoole(user).then(data => {
        let promiseAvatar = Promise.resolve(false);
        if (!data.avatar && user.picture) {
          let pathAvatarTmp = path.normalize(
            Constant.uploads_folder + 'tmp/' + Date.now() + '.jpg',
          );
          promiseAvatar = Utility.download(user.picture, pathAvatarTmp);
        }

        promiseAvatar
          .catch(e => {
            debug(e);
            return false;
          })
          .then(async imgPath => {
            if (imgPath)
              data.avatar = await Utility.move(
                imgPath,
                Constant.uploads_folder,
                data.id.toString() + '/' + Date.now() + '.jpg',
              );
            data.save();
            createNewSession(req, res, data, {
              fcmToken: body.fcm_token,
              device: body.device,
              accessToken: body.accessToken,
            });
          });
      });
    })
    .catch(error => {
      Utility.generateMessage(res, error);
    });
  // let promiseAvatar = Promise.resolve(false);
  //       if (user.) {
  //         let pathAvatarTmp = path.normalize(Constant.uploads_folder + 'tmp/' + Date.now() + '.jpg');
  //         promiseAvatar = download(profile.data.picture, pathAvatarTmp);
  //       }
});

// /**
//  * Forgot Password
//  */
// app.get(ApiList.pwd_check_token, Utility.catchError(checkTokenResetPwd))
app.post(ApiList.reset_password, Utility.catchError(changePassword));
app.post(ApiList.forgot_password, Utility.catchError(forgotPassRequest));

// // POST forgot password
function forgotPassRequest(req, res) {
  let email = req.body.email;
  if (!email) return Promise.reject(ErrorCode.invalidEmail);
  return UserModel.findOne({ email })
    .then(async user => {
      if (!user) return Promise.reject(ErrorCode.userNotFound);
      let time = new Date();
      time.setDate(time.getDate() + 1);
      let token = {
        time: time.getTime(),
        pre: '_',
        user: user.id,
      };
      token = jwt.sign(token, Constant.SecrectKey);
      user.pwdForgot = token;
      await user.save();
      let resetInfo = {
        username: user.fullName,
        resetLink:
          Constant.base_url + `${ApiList.pwd_reset_url}/` + user.pwdForgot,
        email: user.email,
      };
      return mailCtrl.sendEmailResetPassword(resetInfo);
    })
    .then(() => {
      Utility.generateMessage(res, null, {});
    });
}

// function checkTokenResetPwd(req, res) {
//   return UserModel.checkTokenChangePwd(req.params.token)
//     .then(() => {
//       Utility.generateMessage(res, null, {})
//     })
// }
function changePassword(req, res) {
  return (
    UserModel.resetPassword(req.body.token, req.body.password)
      // .then(async (user) => {
      // clear all session
      // let logins = await LoginModel.find({ user: user._id.toString(), isExpired: 0 }).exec().map(l => {
      //   return { session: new RegExp(l._id.toString(), 'ig') }
      // })

      // let dbSessions = mongoose.connection.collection('sessions')
      // dbSessions.find({ $or: logins }).forEach(s => {
      //   try {
      //     let session = JSON.parse(s.session)
      //     session.passport = {}
      //     s.session = JSON.stringify(session)
      //     dbSessions.updateOne({ _id: s._id }, { $set: s })
      //   } catch (error) { }
      // })
      // return user;
      .then(user => {
        // socketApi.logoutAll(user)
        Utility.generateMessage(res, null, ErrorCode.resetPwdSuccess);
      })
  );
}

function createNewSession(req, res, user, info) {
  return LoginModel.initSessionFromEmail(user.id, info, function(error, data) {
    if (!error) req.session.login = data;
    Utility.generateMessage(res, error, data);
  });
}

// Global filtering
// Set cookie
// Use session middleware
app.use((req, res, next) => {
  console.log('Api service sessionID: '); // eslint-disable-line no-console
  console.log(req.sessionID); // eslint-disable-line no-console
  // console.log(app.locals) // eslint-disable-line no-console
  if (
    req.originalUrl === '/api/auth' + ApiList.logout ||
    req.originalUrl === '/api/auth' + ApiList.login ||
    req.originalUrl === '/api/auth' + ApiList.register ||
    req.originalUrl === '/api/auth' + ApiList.login_with_google_token ||
    req.originalUrl === '/api/auth' + ApiList.forgot_password
  ) {
    next();
  } else if (req.session.login) {
    // Determine the session status, if it is valid, return to the home page, otherwise go to the login page
    // console.log(`Login sessionID: ${req.sessionID}`) // eslint-disable-line no-console
    console.log(req.session); // eslint-disable-line no-console
    // res.json({ status: 'OK' })
    next();
  } else {
    Utility.generateMessage(res, ErrorCode.authenticateRequired, null, 401);
  }
});

// [POST] /logout
app.post(ApiList.logout, (req, res, next) => {
  // res.clearCookie('userName')
  socketApi.logoutSocket(req.body.socketId);
  req.session.destroy(); // destroy
  res.json({ status: 'OK' });
});

// [GET] /user
app.get('/user', (req, res, next) => {
  res.json({ user: req.session.login.user });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err); // eslint-disable-line no-console
  res.status(401).send(err + '');
});

// -- export app --
module.exports = {
  path: '/api/auth',
  handler: app,
};
