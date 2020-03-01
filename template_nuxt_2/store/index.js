import Socket from '~/plugins/socket';
export const state = () => ({
  app: {
    isAuth: false,
    user: {},
    token: '',
    channel: '',
  },
});

export const mutations = {
  LOGIN_SUCCESS(state, value) {
    state.app.isAuth = true;
    state.app.user = value.user;
    state.app.token = value.token;
    state.app.channel = value.channel;
  },
  LOGOUT(state) {
    state.app.isAuth = false;
    state.app.user = {};
    state.app.token = '';
    state.app.channel = '';
  },
  SET_ISAUTH(state, value) {
    state.app.isAuth = value;
  },
};

export const actions = {
  // 只会在页面刷新时运行一次，需要刷新下页面才行
  // 所以登陆之后不会再次运行，储存数据不生效
  // nuxtServerInit({ commit }, { req }) {
  //   console.log(`----------------store nuxtServerInit 运行`) // eslint-disable-line no-console
  //   console.log(`page-session数据:`) // eslint-disable-line no-console
  //   console.log(req.session) // eslint-disable-line no-console
  //   if (req.session && req.session.userName) {
  //     commit('SET_ISAUTH', true)
  //     commit('SET_USERNAME', req.session.userName)
  //   } else {
  //     commit('SET_ISAUTH', false)
  //     commit('SET_USERNAME', '')
  //   }
  // },
  setIsAuth({ commit }, value) {
    commit('SET_ISAUTH', value);
  },
  setLoginSuccess({ commit }, value) {
    console.log('setLoginSuccess');
    let channel = value.user.role === 999 ? 'admin' : 'api';
    value.channel = channel;
    commit('LOGIN_SUCCESS', value);
    Socket.connect(value.token, channel);
  },
};
