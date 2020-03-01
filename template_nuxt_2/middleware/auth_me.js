export default function({ store, req, redirect, route, app }, next) {
  console.log('---------------Routing middleware me:'); // eslint-disable-line no-console
  // Have permission
  if (store.state.app.isAuth === true || (req && req.session.login)) {
    next();
  } else {
    const pathLogin = app.localePath('login');
    redirect(302, pathLogin);
  }
  console.log('----------------Middleware me end '); // eslint-disable-line no-console
}
