<template>
  <div>
    <TitlePage :title="$t('users.users')" :list-menu="listMenu" />
    <DataTable
      :socket-name="socketName"
      :columns="columns"
      :add="changeItemTable"
      :remove="deleteItemTable"
    />
    <a-modal
      :title="title"
      :visible="visible"
      @ok="handleOk"
      :confirm-loading="confirmLoading"
      @cancel="handleCancel"
      :ok-text="$t('users.ok')"
      :cancel-text="$t('users.cancel')"
    >
      <a-form v-if="!confirmLoading" :form="form">
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
            <a-select-option :value="0">{{ $t('users.none') }}</a-select-option>
            <a-select-option :value="1">{{ $t('users.male') }}</a-select-option>
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
        <a-form-item
          :label="$t('users.about')"
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
        >
          <a-input v-decorator="option.about" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import TitlePage from '~/components/TitlePage.vue';
import DataTable from '~/components/DataTable.vue';
import listMenu from '~/assets/menus';

const socketName = {
  list: 'get_list_user',
  add: 'add_user',
  edit: 'edit_user',
  delete: 'delete_user',
};
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

export default {
  middleware: 'auth_me',
  components: { TitlePage, DataTable },
  data() {
    return {
      listMenu,
      columns: [
        {
          title: this.$t('login.email'),
          dataIndex: 'email',
          sorter: true,
        },
        {
          title: this.$t('users.about'),
          dataIndex: 'about',
        },
        {
          title: this.$t('users.role'),
          dataIndex: 'role',
          sorter: true,
          filters: [
            { text: this.$t('users.banned'), value: 1 },
            { text: this.$t('users.member'), value: 2 },
            { text: this.$t('users.merchant'), value: 3 },
            { text: this.$t('users.moderator'), value: 4 },
            { text: this.$t('users.admin'), value: 998 },
            { text: this.$t('users.superAdmin'), value: 999 },
          ],
          customRender: text => {
            switch (text) {
              case 1:
                return this.$t('users.banned');
              case 2:
                return this.$t('users.member');
              case 3:
                return this.$t('users.merchant');
              case 4:
                return this.$t('users.moderator');
              case 998:
                return this.$t('users.admin');
              case 999:
                return this.$t('users.superAdmin');
            }
          },
        },
        {
          title: this.$t('users.gender'),
          dataIndex: 'gender',
          sorter: true,
          filters: [
            { text: this.$t('users.none'), value: 0 },
            { text: this.$t('users.male'), value: 1 },
            { text: this.$t('users.female'), value: 2 },
          ],
          customRender: text => {
            switch (text) {
              case 0:
                return this.$t('users.none');
              case 1:
                return this.$t('users.male');
              case 2:
                return this.$t('users.female');
            }
          },
        },
        {
          title: this.$t('users.registerDate'),
          dataIndex: 'registerDate',
          sorter: true,
          scopedSlots: { customRender: 'date' },
        },
        {
          title: this.$t('users.action'),
          dataIndex: '_id',
          width: 90,
          scopedSlots: { customRender: 'action' },
        },
      ],
      socketName,
      visible: false,
      confirmLoading: false,
      idItem: null,
      title: '',
      form: this.$form.createForm(this),
      formItemLayout,
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
        about: ['about', { rules: [], initialValue: '' }],
      },
    };
  },
  methods: {
    changeItemTable(_id) {
      this.confirmLoading = true;
      if (_id === false) {
        this.title = this.$t('users.addNewUser');
        for (let key in this.option) {
          this.option[key][1].initialValue = '';
        }
        this.confirmLoading = false;
      } else {
        this.$socket.emit('get_user_by_id', { _id });
        this.idItem = _id;
        this.title = this.$t('users.editTheUser');
      }
      this.visible = true;
    },
    deleteItemTable(_id) {
      const socket = this.$socket;
      this.$confirm({
        title: this.$t('users.areYouSure'),
        content: this.$t('users.someDescriptions'),
        okText: this.$t('users.ok'),
        okType: 'danger',
        cancelText: this.$t('users.cancel'),
        onOk() {
          socket.emit('delete_user', { _id });
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    },
    handleOk(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true;
          if (this.idItem !== null) {
            values._id = this.idItem;
            this.$socket.emit('edit_user', { new_info: values });
          } else {
            this.$socket.emit('add_user', { new_info: values });
          }
        }
      });
    },
    handleCancel(e) {
      e.preventDefault();
      this.visible = false;
    },
  },
  head() {
    return {
      title: 'Template Nuxt 2 - User',
    };
  },
  sockets: {
    socket_result(data) {
      switch (data.key) {
        case 'get_user_by_id':
          for (let key in this.option) {
            this.option[key][1].initialValue = data.data[key];
          }
          this.confirmLoading = false;
          break;
        // case 'delete_user':
        //   break
        case 'edit_user':
        case 'add_user':
          this.visible = false;
          this.confirmLoading = false;
          this.idItem = null;
          break;
      }
      const arrayShow = ['delete_user', 'edit_user'];
      if (arrayShow.includes(data.key)) {
        if (data.success) {
          let message;
          switch (data.key) {
            case 'edit_user':
              message = this.$t('users.editSuccessfully');
              break;
            case 'delete_user':
              message = this.$t('users.deleteSuccessfully');
              break;
          }
          this.$message.success(message);
        } else {
          this.$message.error(JSON.stringify(data.data));
        }
      }
    },
  },
};
</script>

<style></style>
