<template>
  <a-card hoverable>
    <a-row type="flex" justify="space-between" align="middle" class="mb-1">
      <a-col>
        <a-button icon="plus" class="btn-secondary" @click="() => add(false)">{{
          $t('users.add')
        }}</a-button>
      </a-col>
      <a-col>
        <a-input v-model="searchText" :placeholder="$t('users.search')" />
      </a-col>
    </a-row>
    <a-table
      size="middle"
      bordered
      :columns="columns"
      :row-key="record => record._id"
      :data-source="data"
      :pagination="false"
      :loading="loading"
      @change="onTableChange"
      class="mb-1"
    >
      <template slot="date" slot-scope="date">
        {{ date | moment('dddd, MMMM Do YYYY') }}
      </template>
      <template slot="action" slot-scope="id">
        <a-row type="flex" justify="space-around" align="middle">
          <a-button
            shape="circle"
            icon="edit"
            size="small"
            @click="() => add(id)"
          />
          <a-button
            shape="circle"
            icon="delete"
            size="small"
            @click="() => remove(id)"
          />
        </a-row>
      </template>
    </a-table>
    <a-row type="flex" justify="space-between" align="middle">
      <a-col>
        {{ $t('users.showing') }}
        {{ pagination.page * pagination.limit - (pagination.limit - 1) }}
        {{ $t('users.to') }}
        {{ pagination.page * pagination.limit }} {{ $t('users.of') }}
        {{ pagination.total }} {{ $t('users.entries') }}
      </a-col>
      <a-col>
        <a-pagination
          show-size-changer
          :page-size.sync="pagination.limit"
          @showSizeChange="onPaginationChange"
          @change="onPaginationChange"
          :total="pagination.total"
          v-model="pagination.page"
        >
          <template slot="buildOptionText" slot-scope="props">
            <span v-if="props.value !== '50'"
              >{{ props.value }} {{ $t('users.page') }}
            </span>
            <span v-if="props.value === '50'">全部</span>
          </template>
        </a-pagination>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
const map = require('lodash/map');

export default {
  name: 'DataTable',
  props: {
    socketName: {
      type: Object,
      required: true,
    },
    columns: {
      type: Array,
      required: true,
    },
    add: {
      type: Function,
      required: true,
    },
    remove: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      data: [],
      pagination: {},
      loading: true,
      searchText: '',
    };
  },
  watch: {
    searchText(search) {
      this.loading = true;
      this.request.search = search;
      const query = { ...this.$route.query, search };
      this.$router.push({ path: this.$route.path, query });
      this.$socket.emit(this.socketName.list, this.request);
    },
  },
  created() {
    this.request = {};
    const defaultSort = {};
    this.pagination = { total: 20 };
    this.searchText = '';

    for (let key in this.$route.query) {
      if (key === 'filter' || key === 'sort') {
        this.request[key] = JSON.parse(this.$route.query[key]);
        if (key === 'sort') {
          for (let i in this.request[key]) {
            defaultSort[i] = this.request[key][i] === 1 ? 'ascend' : 'descend';
          }
        }
      } else if (key === 'search') {
        this.searchText = this.$route.query[key];
        this.request[key] = this.$route.query[key];
      } else {
        this.request[key] = this.$route.query[key];
      }
      if (key === 'page' || key === 'limit') {
        this.pagination[key] = parseInt(this.$route.query[key]);
      }
    }
    map(this.columns, item => {
      if (item.dataIndex && defaultSort[item.dataIndex]) {
        item.sortOrder = defaultSort[item.dataIndex];
      } else {
        item.sortOrder = false;
      }
      if (item.dataIndex && this.request.filter[item.dataIndex]) {
        item.filteredValue = this.request.filter[item.dataIndex];
      } else {
        item.filteredValue = [];
      }
    });
  },
  mounted() {
    this.$socket.emit(this.socketName.list, this.request);
  },
  sockets: {
    socket_result(data) {
      switch (data.key) {
        case this.socketName.list:
          this.data = data.data.docs;
          this.pagination.total = data.data.total;
          this.pagination.page = data.data.page;
          this.pagination.limit = data.data.limit;
          this.loading = false;
          break;
        case this.socketName.add:
        case this.socketName.edit:
        case this.socketName.delete:
          this.loading = true;
          this.$socket.emit(this.socketName.list, this.request);
          break;
      }
    },
  },
  methods: {
    onTableChange(pagination, filters, sorter) {
      this.loading = true;
      const tempColumns = [...this.columns];
      this.request.filter = {};
      this.request.sort = {};
      map(tempColumns, (item, index) => {
        if (item.dataIndex && item.sorter) {
          tempColumns[index].sortOrder = false;
        }
        if (item.dataIndex && item.filters) {
          tempColumns[index].filteredValue = [];
        }
      });
      for (let key in filters) {
        this.request.filter[key] = filters[key];
        map(tempColumns, (item, index) => {
          if (item.dataIndex && item.filters && item.dataIndex === key) {
            tempColumns[index].filteredValue = filters[key];
          }
        });
      }
      if (sorter) {
        this.request.sort[sorter.field] = sorter.order === 'ascend' ? 1 : -1;
        map(tempColumns, (item, index) => {
          if (
            item.dataIndex &&
            item.sorter &&
            item.dataIndex === sorter.field
          ) {
            tempColumns[index].sortOrder = sorter.order;
          }
        });
      }

      this.request.filter = this.request.filter ? this.request.filter : {};
      this.request.sort = this.request.sort ? this.request.sort : {};
      this.$router.push({
        path: this.$route.path,
        query: {
          ...this.request,
          filter: JSON.stringify(this.request.filter),
          sort: JSON.stringify(this.request.sort),
        },
      });
      this.$socket.emit(this.socketName.list, this.request);
    },
    onPaginationChange(page, limit) {
      this.loading = true;
      this.request.page = page;
      this.request.limit = limit;
      this.pagination.page = page;
      this.pagination.limit = limit;
      const query = { ...this.$route.query, page, limit };
      this.$router.push({ path: this.$route.path, query });
      this.$socket.emit(this.socketName.list, this.request);
    },
  },
};
</script>

<style scoped></style>
