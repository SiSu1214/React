<template>
  <a-row
    class="ant-layout-header"
    type="flex"
    justify="space-between"
    align="middle"
  >
    <a-col class="center-center">
      <a-button
        type="primary"
        size="large"
        shape="circle"
        :icon="collapsed ? 'menu-unfold' : 'menu-fold'"
        class="desktop"
        @click="toggleMenu"
      />
    </a-col>

    <a-col class="center-center">
      <a-dropdown>
        <a-button type="primary" size="large" shape="circle" class="mr-1">
          <i class="anticon">
            <svg
              viewBox="0 0 896 896"
              width="1em"
              height="1em"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                d="M365.1,603.8c-4.4,0-8.3,0-12.3,0c-88.8,0-177.4,0-266.1,0c-51.6,0-86.6-35.2-86.6-86.7c-0.2-118.4,0-237,0-355.5c0-52.5,35.2-87.9,87.7-87.9c183.8-0.2,367.8-0.4,551.6-0.6c6.8,0,13.4,0,20.3,0c7.2,0,12.5,2.4,14.9,9.6c2.4,7-1.1,11.8-6.1,16c-24.3,20.1-48.6,40.3-73.1,60.4c-26.9,21.9-47.3,48.6-56.4,82.1c-4.2,15.8-3.3,33.2-4.8,51.4c5,0,8.3,0,11.4,0c87.1,0,174.4-0.2,261.5,0c54.1,0.2,88.6,34.4,88.8,88.6c0.2,63.5,0,127.1,0,190.6c0,54.3,0.2,108.7,0,163c-0.2,42.7-23.8,74.8-62.4,84.9c-7.9,2-16.4,2.8-24.5,2.8c-190.6,0.2-381.2,0.2-571.9,0.2c-7.6,0-14.4-1.3-17.3-9c-2.9-7.7,1.1-13.3,7.2-18.2c26.7-21.7,53.6-43.1,79.6-65.6c35.7-30.9,55.3-70.5,58.6-117.9C365.3,609.9,365.1,607.5,365.1,603.8zM273.2,793.5c0.2,0.7,0.6,1.3,0.7,2c3.3,0,6.6,0,9.9,0c112.3,0,224.5,0,336.9,0c63,0,125.8,0,188.8,0c28.7,0,50.5-15.7,56.9-41.4c1.8-7.4,2-15.1,2-22.8c0.2-78.5,0.2-157.1,0-235.6c0-41.4,0.4-82.9-0.7-124.3c-0.7-28-24.9-51-53-51c-122.1-0.2-244.2-0.2-366.3,0c-23.8,0-44.2,14.4-51.4,36.3c-2.8,8.3-3.5,17.5-3.5,26.2c-0.2,71.1,0,142.4-0.2,213.5c-0.2,65.9-25.6,120.1-77,161.9C301.9,769.8,287.6,781.5,273.2,793.5z M254.6,225.9c-6.1,0-10.9,0-15.7,0c-38.3,0-76.8,0-115.1,0c-9.8,0-15.3,5-15.5,13.1c-0.2,8.3,5.2,13.6,14.5,14.5c2.2,0.2,4.2,0.2,6.4,0.2c53.4,0,106.8,0,160.2,0c15.7,0,31.1,0,47.9,0c-13.3,47.9-37.6,87.7-72,124.7c-16-20.6-31.1-40-45.9-59.5c-6.1-8.1-13.4-10.5-20.4-5.9c-7,4.6-8.3,12.5-2.8,21c5.9,9,12,17.9,18.8,26.2c9.9,12.3,20.6,24.1,31.1,36.5c-1.5,1.3-2.6,2.4-3.7,3.3c-33,28.4-70.2,49.2-110.3,65.2c-9.4,3.7-13.1,11.2-9.9,18.8c3.1,7.7,10.9,10.5,20.1,6.8c32-12.5,62.6-28.2,90.6-48.4c11.6-8.3,22.8-17.5,34.8-26.5c29.3,25.6,61.1,47,98.2,63.9c0-8.5-0.4-15.5,0.2-22.3c0.4-5.9-1.7-9.4-7-12.3c-11.6-6.3-23-12.9-33.9-20.3c-13.1-8.8-25.4-18.8-38.3-28.5c37.8-40.5,64.3-85.5,78.3-137.6c0.6-2,4.4-4.6,7-4.6c13.4-0.4,27.1-0.2,40.5-0.2c7.4,0,13.3-2.2,16-9.8c3.3-9.2-3.5-17.9-14.7-17.9c-31.7-0.2-63.2,0-94.9,0c-11.8,0-23.8,0-36.1,0c-0.2-3.5-0.6-5.9-0.6-8.3c0-11.4,0.2-22.7-0.2-34.1c-0.2-8.1-5.5-13.8-12.7-14.4c-7-0.6-13.3,4.8-14.4,12.7c-0.6,3.9-0.4,7.9-0.4,12C254.6,204.1,254.6,214.6,254.6,225.9z M753.9,694.8c-3.7,3.3-7.4,8.7-12.3,10.3c-7.4,2.6-12.9-1.7-15.8-8.8c-7.4-17.9-14.5-35.7-21.9-53.6c-2.4-5.7-5-11.2-6.8-16.9c-1.7-5-4.6-6.4-9.6-6.3c-38.1,0.2-76.1,0.2-114.2,0c-5.7,0-8.1,2.2-9.9,7.2c-9.2,23.4-18.6,46.6-28.4,69.8c-3.5,8.7-11.1,11.8-18.6,8.5c-7-3.1-9.6-10.1-6.8-18.6c0.6-1.7,1.3-3.5,2-5.2c13.6-33.5,27.1-67,40.7-100.4c20.6-50.8,41.3-101.5,61.9-152.3c0.6-1.5,1.3-2.8,1.7-4.2c2.6-6.6,6.1-12.2,14.4-12.2c8.1,0,11.6,5.3,14.4,12c22.5,55.6,45.1,111.2,67.8,166.7c12.2,29.8,24.3,59.5,36.3,89.3C750.4,684.1,751.5,688.2,753.9,694.8z M630.3,462c-18,44.2-35.2,86.4-52.5,129.1c35.4,0,69.4,0,104.8,0C665.3,547.8,648.4,506,630.3,462z"
              />
            </svg>
          </i>
        </a-button>
        <a-menu slot="overlay" class="header-dropdown">
          <a-list item-layout="vertical" bordered :data-source="otherLocales">
            <a-list-item
              slot="renderItem"
              slot-scope="item"
              @click="switchLanguage(item.code)"
            >
              <a-list-item-meta>
                <strong slot="title"> {{ $t('header.' + item.name) }}</strong>
              </a-list-item-meta>
            </a-list-item>
            <div slot="header">{{ $t('header.changeLanguage') }}</div>
          </a-list>
        </a-menu>
      </a-dropdown>
      <a-dropdown>
        <a-menu slot="overlay" class="header-dropdown">
          <a-list item-layout="vertical" bordered :data-source="notification">
            <a-list-item slot="renderItem" slot-scope="item">
              <a-list-item-meta description="2 min ago">
                <strong slot="title"> {{ $t(item.name) }}</strong>
                <a-avatar
                  slot="avatar"
                  :style="'backgroundColor:' + item.color"
                  :icon="item.icon"
                />
              </a-list-item-meta>
            </a-list-item>
            <div slot="header">{{ $t('header.newNotifications') }}</div>
            <div class="text-center" slot="footer">
              <a href=":javascript;">{{ $t('header.viewAll') }}</a>
            </div>
          </a-list>
        </a-menu>
        <a-button type="primary" size="large" shape="circle" class="mr-1">
          <a-badge
            :offset="[2, -2]"
            count="3"
            :number-style="{
              'background-image':
                'linear-gradient(58deg, #2bcd72 0, #9acd2b 100%)',
            }"
          >
            <a-icon type="bell" />
          </a-badge>
        </a-button>
      </a-dropdown>
      <a-dropdown>
        <a-menu slot="overlay" class="header-dropdown">
          <a-list size="small" bordered :data-source="avatar">
            <a-list-item
              slot="renderItem"
              slot-scope="item"
              @click="clickOn(item)"
            >
              <a-avatar
                :style="'margin-right: 10px;backgroundColor:' + item.color"
                size="small"
                :icon="item.icon"
              />
              {{ $t(item.name) }}
            </a-list-item>
            <span slot="header"
              >{{ $t('header.welcome') }},
              {{ $store.state.app.user.email }}</span
            >
          </a-list>
        </a-menu>
        <a-avatar size="large" src="/images/avatar.png" />
      </a-dropdown>
      <a-button
        type="primary"
        size="large"
        shape="circle"
        :icon="collapsed ? 'menu-unfold' : 'menu-fold'"
        class="mobile"
        @click="toggleMenu"
      />
    </a-col>
  </a-row>
</template>

<script>
export default {
  name: 'Header',
  props: {
    collapsed: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      notification: [
        {
          name: 'header.textNew',
          icon: 'user-add',
          color: '#4c7cf3',
        },
        {
          name: 'header.textNew',
          icon: 'shopping-cart',
          color: '#52c4ca',
        },
        {
          name: 'header.textNew',
          icon: 'like',
          color: '#ff4b5b',
        },
      ],
      avatar: [
        {
          key: 'administrator-settings',
          name: 'header.settings',
          icon: 'setting',
          color: '#4c7cf3',
        },
        {
          key: 'logout',
          name: 'header.logout',
          icon: 'poweroff',
          color: '#ff4b5b',
        },
      ],
    };
  },
  computed: {
    otherLocales() {
      return this.$i18n.locales.filter(
        ({ code }) => code !== this.$i18n.locale,
      );
    },
  },
  methods: {
    toggleMenu() {
      this.$emit('update:collapsed', !this.collapsed);
    },
    logout() {
      console.log('out');
      this.$axios({
        url: '/api/auth/logout',
        method: 'post',
        data: { socketId: this.$socket.id },
      }).finally(() => {
        this.$message.success(this.$t('header.msgLogout'));
        this.$store.commit('LOGOUT');
        this.$router.push(this.localePath('login'));
      });
    },
    clickOn(item) {
      switch (item.key) {
        case 'administrator-settings':
          this.$router.push(this.localePath(item.key));
          break;
        case 'logout':
          this.logout();
          break;
      }
    },
    switchLanguage(code) {
      this.$router.push(this.switchLocalePath(code));
    },
  },
};
</script>

<style></style>
