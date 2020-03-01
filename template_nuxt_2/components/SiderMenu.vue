<template>
  <a-layout-sider
    :trigger="null"
    collapsible
    v-model="collapsed"
    theme="light"
    width="250"
  >
    <Logo :collapsed="collapsed" link-logo="administrator" />
    <a-menu
      mode="inline"
      @click="handleClick"
      :default-selected-keys="current"
      :open-keys="openKeys"
      @openChange="onOpenChange"
    >
      <template v-for="(item, index) in listMenu">
        <a-menu-item-group :key="index" :title="$t(item.name)">
          <template v-for="(menu, indexMenu) in item.children">
            <a-menu-item v-if="!menu.children" :key="menu.url">
              <a-icon :type="menu.icon" />
              <span> {{ $t(menu.name) }}</span>
            </a-menu-item>
            <a-sub-menu v-if="!!menu.children" :key="'s' + index + indexMenu">
              <div slot="title">
                <a-icon :type="menu.icon" />
                <span>{{ $t(menu.name) }}</span>
              </div>
              <a-menu-item v-for="subMenu in menu.children" :key="subMenu.url">
                {{ $t(subMenu.name) }}
              </a-menu-item>
            </a-sub-menu>
          </template>
        </a-menu-item-group>
      </template>
    </a-menu>
  </a-layout-sider>
</template>

<script>
import Logo from '~/components/Logo.vue';
const map = require('lodash/map');

export default {
  name: 'SiderMenu',
  components: {
    Logo,
  },
  props: {
    collapsed: {
      type: Boolean,
      default: false,
    },
    listMenu: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      openKeys: [],
    };
  },
  created() {
    const url = this.$route.name && this.$route.name.split('__')[0];
    let openKey;
    this.rootSubmenuKeys = [];
    map(this.listMenu, (item, index) => {
      map(item.children, (menu, indexMenu) => {
        if (menu.url !== url && !openKey) {
          map(menu.children, subMenu => {
            this.rootSubmenuKeys.push('s' + index + indexMenu);
            if (subMenu.url === url && !openKey) {
              openKey = 's' + index + indexMenu;
            }
          });
        }
      });
    });
    if (url && url.split('-').length > 1) {
      this.openKeys = openKey ? [openKey] : [];
    }
    this.current = [url];
  },
  methods: {
    handleClick(e) {
      map(this.listMenu, item => {
        map(item.children, menu => {
          if (menu.url !== e.key) {
            map(menu.children, subMenu => {
              if (subMenu.url === e.key) {
                this.$router.push({
                  path: this.localePath(e.key),
                  query: subMenu.query,
                });
              }
            });
          } else {
            this.$router.push({
              path: this.localePath(e.key),
              query: menu.query,
            });
          }
        });
      });
    },
    onOpenChange(openKeys) {
      const latestOpenKey = openKeys.find(key => !this.openKeys.includes(key));
      if (!this.rootSubmenuKeys.includes(latestOpenKey)) {
        this.openKeys = openKeys;
      } else {
        this.openKeys = latestOpenKey ? [latestOpenKey] : [];
      }
    },
  },
};
</script>

<style></style>
