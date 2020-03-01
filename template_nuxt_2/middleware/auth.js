export default function({ store, req, redirect, route, app }) {
  // Have permission
  if (process.server) {
    const pathLogin = app.localePath('login');
    const pathAdministrator = app.localePath('administrator');
    if (store.state.app.isAuth === false && req && req.session.login) {
      // Update store data
      // The store will not update immediately after updating the data.
      store.dispatch('setLoginSuccess', req.session.login);
      if (route.path === pathLogin) {
        // Have permission but jump to the landing page, directed to the home page
        redirect(302, pathAdministrator);
      }
    } else if (/^\/administrator/.test(route.path)) {
      let query = route.query ? JSON.stringify(route.query) : '';
      if (/^\/administrator\/{0,1}/.test(route.path)) {
        return redirect(
          '/login?redirect=' + route.path + (query ? '&query=' + query : ''),
        );
      }
    }
  }
}
