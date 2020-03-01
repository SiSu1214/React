export default [
  {
    name: 'dashboard.main',
    children: [
      {
        name: 'dashboard.dashboard',
        icon: 'dashboard',
        url: 'administrator',
        query: {},
      },
      {
        name: 'users.users',
        icon: 'team',
        children: [
          {
            name: 'users.client',
            url: 'administrator-users',
            query: {
              page: 1,
              limit: 10,
              search: '',
              filter: '{}',
              sort: '{"registerDate": -1}',
            },
          },
        ],
      },
    ],
  },
  {
    name: 'dashboard.extras',
    children: [
      {
        name: 'settings.settings',
        icon: 'setting',
        url: 'administrator-settings',
        query: {},
      },
    ],
  },
];
