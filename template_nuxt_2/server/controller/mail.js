'use strict';
const nodemailer = require('nodemailer');
let fs = require('fs');
const ejs = require('ejs');
const path = require('path');
const Promise = require('bluebird');
const config = require('../../constant.js');
const debug = require('debug')(config.debug_name + ':email');
const tempResetPassword = ejs.compile(
  fs.readFileSync(
    path.join(__dirname, '../', 'temp_emails', 'tempresetpassword.ejs'),
    'utf8',
  ),
  { cache: true, filename: 'tempresetpassword.ejs' },
);

let transporter = null;

function createTransport() {
  // create reusable transporter object using the default SMTP transport
  transporter = nodemailer.createTransport({
    // host: config.admin_email_domain,
    // port: 465,// 587
    // secure: true, // true for 465, false for other ports
    service: 'gmail',
    // timeout: 10000,
    // port: 465,
    // secure: true,
    auth: {
      user: config.admin_email,
      pass: config.admin_email_password,
    },
  });
}
createTransport();
(async function() {
  try {
    let verify = await transporter.verify();
    debug('verify transporter ' + verify);
  } catch (e) {
    debug('verify transporter false.' + JSON.stringify(e));
  }
})();

function sendEmailResetPassword(data, callback) {
  data = Object.assign(data, { base_url: config.base_url });
  return new Promise(async function(resolve, reject) {
    // setup email data with unicode symbols
    let mailOptions = {
      from: config.admin_email, // sender address
      to: data.email, // list of receivers
      replyTo: config.admin_email,
      subject: 'Reset Password', // Subject line
      // text: 'Hello world?', // plain text body
      html: tempResetPassword(data), // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        debug('send mail error: ' + JSON.stringify(error));
        return reject(error);
      }
      debug('Message sent: %s', info.messageId);
      resolve(info);
    });
  }).asCallback(callback);
}

module.exports.sendEmailResetPassword = sendEmailResetPassword;
