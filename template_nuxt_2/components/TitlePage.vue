<template>
  <a-row type="flex" justify="space-between" align="middle">
    <a-col>
      <h5>{{ title }}</h5>
    </a-col>
    <a-col v-if="routes">
      <a-breadcrumb>
        <a-breadcrumb-item v-for="(route, index) in routes" :key="index">
          <span v-if="!route.path">
            {{ $t(route.breadcrumbName) }}
          </span>
          <nuxt-link
            v-else
            :to="{ path: localePath(route.path), query: route.query }"
          >
            <a-icon v-if="route.icon" :type="route.icon" />
            <span v-if="route.breadcrumbName">{{
              $t(route.breadcrumbName)
            }}</span>
          </nuxt-link>
        </a-breadcrumb-item>
      </a-breadcrumb>
    </a-col>
  </a-row>
</template>

<script>
const map = require('lodash/map');

export default {
  name: 'TitlePage',
  props: {
    title: {
      type: String,
      default: '',
    },
    listMenu: {
      type: Array,
      default: () => [],
    },
  },
  created() {
    const url = this.$route.name.split('__')[0];
    let objectFirst = {};
    this.routes = [];
    map(this.listMenu, (item, index) => {
      map(item.children, (menu, i) => {
        if (index === 0 && i === 0) {
          objectFirst = { icon: 'home', path: menu.url, query: menu.query };
        }
        if (menu.url !== url && !this.routes.length) {
          map(menu.children, subMenu => {
            if (subMenu.url === url && !this.routes.length) {
              this.routes = [
                objectFirst,
                {
                  path: menu.url,
                  breadcrumbName: menu.name,
                  query: menu.query,
                },
                {
                  path: subMenu.url,
                  breadcrumbName: subMenu.name,
                  query: subMenu.query,
                },
              ];
            }
          });
        } else if (menu.url === url) {
          this.routes = [objectFirst, { breadcrumbName: menu.name }];
        }
      });
    });
  },
};
</script>

<style scoped>
.ant-row-flex {
  margin-bottom: 15px;
}
</style>
