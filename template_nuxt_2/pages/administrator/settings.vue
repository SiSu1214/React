<template>
  <div>
    <TitlePage :title="$t('settings.settings')" :list-menu="[]" />
    <a-row :gutter="22">
      <a-col :xl="8" class="mb-2">
        <a-card hoverable :title="$t('settings.profile')">
          <a-upload
            name="avatar"
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            action="//jsonplaceholder.typicode.com/posts/"
            :before-upload="beforeUpload"
            @change="handleChange"
          >
            <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
            <div v-else>
              <a-icon :type="loading ? 'loading' : 'plus'" />
              <div class="ant-upload-text">{{ $t('profile.upload') }}</div>
            </div>
          </a-upload>
          <a-divider />
          <a-form :form="form" v-if="!loadingForm">
            <a-form-item
              :label="$t('login.email')"
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
            >
              <a-input v-decorator="option.email" />
            </a-form-item>
            <a-form-item
              :label="$t('login.password')"
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
            >
              <a-input v-decorator="option.password" />
            </a-form-item>
            <a-form-item
              :label="$t('users.gender')"
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
            >
              <a-select v-decorator="option.gender">
                <a-select-option :value="0">{{
                  $t('users.none')
                }}</a-select-option>
                <a-select-option :value="1">{{
                  $t('users.male')
                }}</a-select-option>
                <a-select-option :value="2">{{
                  $t('users.female')
                }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item
              :label="$t('users.role')"
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
            >
              <a-select v-decorator="option.role">
                <a-select-option :value="1">{{
                  $t('users.banned')
                }}</a-select-option>
                <a-select-option :value="2">{{
                  $t('users.member')
                }}</a-select-option>
                <a-select-option :value="3">{{
                  $t('users.merchant')
                }}</a-select-option>
                <a-select-option :value="4">{{
                  $t('users.moderator')
                }}</a-select-option>
                <a-select-option :value="998">{{
                  $t('users.admin')
                }}</a-select-option>
                <a-select-option :value="999">{{
                  $t('users.superAdmin')
                }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-form>
          <a-button
            type="primary"
            block
            @click="handleOk"
            :loading="loadingForm"
          >
            {{ $t('profile.saveChange') }}
          </a-button>
        </a-card>
      </a-col>
      <a-col :xl="8" class="mb-2">
        <a-card hoverable :title="$t('settings.general')">
          <a-list item-layout="horizontal" :data-source="settings" class="mb-1">
            <a-list-item
              slot="renderItem"
              slot-scope="item, index"
              @click="onChangeSetting(index, !item.status)"
            >
              <a-list-item-meta>
                <span slot="title">
                  {{ $t('settings.' + item.name) }} {{ index + 1 }}
                </span>
              </a-list-item-meta>
              <span slot="actions">
                <a-switch :checked="item.status" />
              </span>
            </a-list-item>
          </a-list>
          <a-button type="primary" block>
            {{ $t('profile.saveChange') }}
          </a-button>
        </a-card>
      </a-col>
      <a-col :xl="8" class="mb-2">
        <a-card hoverable :title="$t('settings.general')">
          <a-list item-layout="horizontal" :data-source="settings" class="mb-1">
            <a-list-item
              slot="renderItem"
              slot-scope="item, index"
              @click="onChangeSetting(index, !item.status)"
            >
              <a-list-item-meta>
                <span slot="title">
                  {{ $t('settings.' + item.name) }} {{ index + 1 }}
                </span>
              </a-list-item-meta>
              <span slot="actions">
                <a-switch :checked="item.status" />
              </span>
            </a-list-item>
          </a-list>
          <a-button type="primary" block>
            {{ $t('profile.saveChange') }}
          </a-button>
        </a-card>
      </a-col>
      <a-col :xl="8" class="mb-2">
        <a-card hoverable :title="$t('settings.general')">
          <a-list item-layout="horizontal" :data-source="settings" class="mb-1">
            <a-list-item
              slot="renderItem"
              slot-scope="item, index"
              @click="onChangeSetting(index, !item.status)"
            >
              <a-list-item-meta>
                <span slot="title">
                  {{ $t('settings.' + item.name) }} {{ index + 1 }}
                </span>
              </a-list-item-meta>
              <span slot="actions">
                <a-switch :checked="item.status" />
              </span>
            </a-list-item>
          </a-list>
          <a-button type="primary" block>
            {{ $t('profile.saveChange') }}
          </a-button>
        </a-card>
      </a-col>
      <a-col :xl="8" class="mb-2">
        <a-card hoverable :title="$t('settings.general')">
          <a-list item-layout="horizontal" :data-source="settings" class="mb-1">
            <a-list-item
              slot="renderItem"
              slot-scope="item, index"
              @click="onChangeSetting(index, !item.status)"
            >
              <a-list-item-meta>
                <span slot="title">
                  {{ $t('settings.' + item.name) }} {{ index + 1 }}
                </span>
              </a-list-item-meta>
              <span slot="actions">
                <a-switch :checked="item.status" />
              </span>
            </a-list-item>
          </a-list>
          <a-button type="primary" block>
            {{ $t('profile.saveChange') }}
          </a-button>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import TitlePage from '~/components/TitlePage.vue';

const settings = [
  {
    name: 'general',
    status: true,
  },
  {
    name: 'general',
    status: false,
  },
  {
    name: 'general',
    status: true,
  },
  {
    name: 'general',
    status: false,
  },
];

const formItemLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

export default {
  middleware: 'auth_me',
  components: { TitlePage },
  data() {
    return {
      loading: false,
      loadingForm: false,
      imageUrl: '',
      formItemLayout,
      settings,
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
              { min: 6, message: this.$t('login.msgPasswordMin') },
            ],
            initialValue: '',
          },
        ],
        gender: [
          'gender',
          {
            rules: [{ required: true, message: this.$t('users.pleaseGender') }],
            initialValue: '',
          },
        ],
        role: [
          'role',
          {
            rules: [{ required: true, message: this.$t('users.pleaseRole') }],
            initialValue: '',
          },
        ],
      },
    };
  },
  mounted() {
    const data = {
      email: 'admin@admin.com',
      password: 'admin',
      gender: 1,
      role: 2,
    };
    for (let key in this.option) {
      this.option[key][1].initialValue = data[key];
    }
  },
  methods: {
    onChangeSetting(index, value) {
      this.settings[index].status = value;
    },
    handleChange(info) {
      if (info.file.status === 'uploading') {
        this.loading = true;
        return;
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        this.getBase64(info.file.originFileObj, imageUrl => {
          this.imageUrl = imageUrl;
          this.loading = false;
        });
      }
    },
    getBase64(img, callback) {
      const reader = new FileReader();
      reader.addEventListener('load', () => callback(reader.result));
      reader.readAsDataURL(img);
    },
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      if (!isJPG) {
        this.$message.error('You can only upload JPG file!');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error('Image must smaller than 2MB!');
      }
      return isJPG && isLt2M;
    },
    handleOk(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log(values);
        }
      });
    },
    // reload() {
    // hot reload locales
    // this.$i18n.setLocaleMessage('en', require('../../../assets/locales/lang/en.json'))
    // },
  },
  head() {
    return {
      title: 'Template Nuxt 2 - Settings',
    };
  },
};
</script>

<style>
.avatar-uploader > .ant-upload {
  width: 100%;
}

.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
