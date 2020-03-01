const { google } = require('googleapis');
const Constant = require('../../constant');
const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2(
  Constant.GOOGLE_CLIENT_ID,
  Constant.GOOGLE_CLIENT_SERECT,
);
const Promise = require('bluebird');
const TokenRequired = require('./error_code').googleTokenRequired;

module.exports = accessToken => {
  if (!accessToken) return Promise.reject(TokenRequired);

  // after acquiring an oAuth2Client...
  oauth2Client.setCredentials({ access_token: accessToken });
  let oauth2 = google.oauth2({
    auth: oauth2Client,
    version: 'v2',
  });

  return new Promise((resolve, reject) => {
    oauth2.userinfo.v2.me.get((err, profile) => {
      if (err || profile.status != 200) return reject(err);
      let user = {
        email: profile.data.email,
        firstName: profile.data.given_name,
        lastName: profile.data.family_name,
        fullName: profile.data.name,
        googleId: profile.data.id,
        gender: profile.data.gender == 'male' ? 1 : 0,
        picture: profile.data.picture,
      };
      resolve(user);
    });
  });
};
