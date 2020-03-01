module.exports = {
  MissingParams: e => ({ key: 'common.missingParam', data: e }),
  invalidEmail: { key: 'common.invalidEmail', field: 'email' },
  emailInUse: { key: 'register.emailInUse', field: 'email' },
  invalidPassword: { key: 'common.invalidPassword', field: 'password' },
  userBanned: { key: 'common.userBanned' },
  userNotFound: { key: 'common.userNotFound' },
  authenticateRequired: { key: 'authenticateRequired' },
  passwordIncorrect: { key: 'login.passwordIncorrect', field: 'password' },
  googleTokenRequired: { key: 'login.googleTokenRequired' },
  forgotPwdTokenInvalid: { key: 'forgotPassword.forgotPwdTokenInvalid' },
  forgotPwdTokenExpired: { key: 'forgotPassword.forgotPwdTokenExpired' },
  forgotPwdChanged: { key: 'resetPassword.forgotPwdChanged' },
  resetPwdSuccess: { key: 'resetPassword.success' },
  passwordNewRequired: {
    key: 'changePassword.passwordNewRequired',
    field: 'password_new',
  },
  currentPasswordNotMatch: {
    key: 'changePassword.currentPasswordNotMatch',
    field: 'password_old',
  },
};
