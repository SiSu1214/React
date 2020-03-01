<template>
  <div class="login-page">
    <a-row type="flex" justify="center" align="middle" class="vh-100">
      <a-card hoverable>
        <div class="text-center">
          <Logo link-logo="login" />
          <h4>{{ $t('register.createNewAccount') }}</h4>
          <p class="text-muted">
            {{ $t('register.alreadyHaveAccount') }}
            <nuxt-link :to="localePath('login')">{{
              $t('login.signIn')
            }}</nuxt-link>
            {{ $t('login.here') }}
          </p>
          <div>
            <a-button class="btn-facebook" type="primary" icon="facebook">
              <span class="mobile">Facebook</span>
            </a-button>
            <a-button
              class="btn-google-plus"
              type="primary"
              @click="googleLogin()"
              icon="google-plus"
            >
              <span class="mobile">Google+</span>
            </a-button>
          </div>
          <a-divider>
            <span class="text-muted">{{ $t('login.or') }}</span>
          </a-divider>
        </div>

        <a-form :form="form" @submit="handleSubmit">
          <a-form-item :wrapper-col="formItemLayout.wrapperCol">
            <a-input
              v-decorator="option.email"
              :placeholder="$t('login.email')"
            />
          </a-form-item>
          <a-form-item :wrapper-col="formItemLayout.wrapperCol">
            <a-input
              v-decorator="option.password"
              :placeholder="$t('login.password')"
            />
          </a-form-item>
          <a-form-item>
            <a-checkbox
              :checked="option.isSave"
              @change="option.isSave = !option.isSave"
            >
              {{ $t('register.iAgree') }}
            </a-checkbox>
          </a-form-item>
          <a-button type="primary" html-type="submit" block>
            {{ $t('register.createAnAccount') }}
          </a-button>
        </a-form>
      </a-card>
    </a-row>
  </div>
</template>

<script>
import Logo from '~/components/Logo.vue';

/* global gapi */
export default {
  layout: 'login',
  name: 'Register',
  components: { Logo },
  data() {
    return {
      formItemLayout: {
        wrapperCol: { span: 24 },
      },
      form: this.$form.createForm(this),
      option: {
        email: [
          'email',
          {
            rules: [
              { required: true, message: this.$t('login.msgEmailRequired') },
              {
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: this.$t('users.pleaseEmailFormat'),
              },
            ],
            initialValue: '',
          },
        ],
        password: [
          'password',
          {
            rules: [
              { required: true, message: this.$t('login.msgPasswordRequired') },
            ],
            initialValue: '',
          },
        ],
        isSave: false,
      },
    };
  },
  mounted() {
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id:
          '368826235155-cg7nfnucojc0pev66g7sfsepg2ku78i9.apps.googleusercontent.com',
        fetch_basic_profile: true,
        scope: 'profile',
      });
    });
  },
  methods: {
    googleLogin() {
      this.auth2.signIn().then(() => {
        let user = this.auth2.currentUser.get();
        let profile = user.getBasicProfile();
        let accessToken = user.getAuthResponse().access_token;
        let info = {
          googleId: profile.getId(),
          fullName: profile.getName(),
          lastName: profile.getGivenName(),
          firstName: profile.getFamilyName(),
          avatar: profile.getImageUrl(),
          email: profile.getEmail(),
          accessToken,
        };
        this.$axios({
          url: '/api/auth/login_with_google_token',
          method: 'post',
          data: info,
        })
          .then(res => {
            console.log(res);
            let response = res.data;
            if (response.success)
              this.$store.dispatch('setLoginSuccess', response.data);
            this.$message.success(this.$t('login.msgLoginSuccess'));
            this.$router.push(this.localePath('administrator'));
          })
          .catch(err => {
            console.log(err);
          });
      });
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          values.isSave = this.option.isSave;
          this.$axios({
            url: '/api/auth/register/local',
            method: 'post',
            data: { ...values },
          })
            .then(res => {
              this.$message.success(this.$t('register.msgRegisterSuccess'));
              this.$router.push(this.localePath('index'));
            })
            .catch(e => {
              this.$message.error(this.$t('register.msgRegisterError'));
            });
        }
      });
    },
  },
  head() {
    return {
      title: 'Template Nuxt 2 - Register',
      meta: [
        {
          name: 'google-signin-client_id',
          content:
            '368826235155-cg7nfnucojc0pev66g7sfsepg2ku78i9.apps.googleusercontent.com',
        },
      ],
      script: [
        {
          src: 'https://apis.google.com/js/platform.js',
          async: true,
          defer: true,
        },
      ],
    };
  },
};
</script>

<style lang="less"></style>
