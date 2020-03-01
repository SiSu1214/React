<template>
  <div class="login-page">
    <a-row type="flex" justify="center" align="middle" class="vh-100">
      <a-card hoverable>
        <div class="text-center">
          <Logo link-logo="login" />
          <h4>{{ $t('forgotPassword.forgotPassword') }}</h4>
          <p>
            {{ $t('forgotPassword.rememberPassword') }}
            <nuxt-link :to="localePath('login')">{{
              $t('login.signIn')
            }}</nuxt-link>
            {{ $t('login.here') }}
          </p>
          <p>{{ $t('forgotPassword.resetPassword') }}</p>
        </div>

        <a-form :form="form" @submit="handleSubmit">
          <a-form-item :wrapper-col="formItemLayout.wrapperCol">
            <a-input
              v-decorator="option.userName"
              :placeholder="$t('login.email')"
            />
          </a-form-item>
          <a-button type="primary" html-type="submit" block>
            {{ $t('forgotPassword.sendEmail') }}
          </a-button>
        </a-form>
      </a-card>
    </a-row>
  </div>
</template>

<script>
import Logo from '~/components/Logo.vue';
const regExpEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default {
  layout: 'login',
  name: 'ForgotPassword',
  components: { Logo },
  data() {
    return {
      formItemLayout: {
        wrapperCol: { span: 24 },
      },
      form: this.$form.createForm(this),
      option: {
        userName: [
          'email',
          {
            rules: [
              { required: true, message: this.$t('login.msgEmailRequired') },
              {
                pattern: regExpEmail,
                message: this.$t('users.pleaseEmailFormat'),
              },
            ],
            initialValue: '',
          },
        ],
      },
    };
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          this.$axios({
            url: '/api/auth/forgot_password',
            method: 'post',
            data: { ...values },
          })
            .then(res => {
              this.$message.success(this.$t('forgotPassword.msgForgotSuccess'));
              this.$router.push(this.localePath('login'));
            })
            .catch(e => {
              this.$message.error(this.$t('forgotPassword.msgForgotError'));
            });
        }
      });
    },
  },
  head() {
    return {
      title: 'Template Nuxt 2 - Forgot Password',
    };
  },
};
</script>

<style lang="less"></style>
