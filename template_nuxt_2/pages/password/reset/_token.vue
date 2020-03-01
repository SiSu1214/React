<template>
  <div class="login-page">
    <a-row type="flex" justify="center" align="middle" class="vh-100">
      <a-card hoverable>
        <div class="text-center">
          <Logo link-logo="login" />
          <h4>{{ $t('resetPassword.resetPassword') }}</h4>
        </div>

        <a-form :form="form" @submit="handleSubmit">
          <a-form-item :wrapper-col="formItemLayout.wrapperCol">
            <a-input
              v-decorator="option.password"
              :placeholder="$t('login.password')"
            />
          </a-form-item>
          <a-form-item :wrapper-col="formItemLayout.wrapperCol">
            <a-input
              v-decorator="option.confirmPassword"
              :placeholder="$t('resetPassword.confirmPassword')"
            />
          </a-form-item>
          <a-button type="primary" html-type="submit" block>
            {{ $t('resetPassword.resetPassword') }}
          </a-button>
        </a-form>
      </a-card>
    </a-row>
  </div>
</template>

<script>
import Logo from '~/components/Logo.vue';

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
        password: [
          'password',
          {
            rules: [
              { required: true, message: this.$t('login.msgPasswordRequired') },
            ],
            initialValue: '',
          },
        ],
        confirmPassword: [
          'confirmPassword',
          {
            rules: [
              {
                required: true,
                message: this.$t('resetPassword.PleaseConfirmPassword'),
              },
              {
                validator: (rule, value, callback) => {
                  let { getFieldValue } = this.form;
                  let text = this.$t('resetPassword.TheConfirmPassword');
                  if (value && value !== getFieldValue('password')) {
                    callback(text);
                  } else {
                    callback();
                  }
                },
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
          console.log(values);
          // values.isSave = this.option.isSave
          this.$axios({
            url: '/api/auth/reset_password',
            method: 'post',
            data: { ...values, token: this.$route.params.token },
          })
            .then(res => {
              this.$message.success(this.$t('resetPassword.success'));
              this.$router.push(this.localePath('index'));
            })
            .catch(e => {
              let data = e.response.data;
              let errorKey = data.data.key || 'commom.error';
              this.$message.error(this.$t(errorKey));
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
