import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
      component: require('@/layouts/DefaultLayout').default,
      children: [
        {
          path: '/dashboard',
          name: 'dashboard',
          component: require('@/views/Dashboard').default
        },
        {
          path: '/user',
          name: 'user',
          component: require('@/views/User/User').default,
          children: [
            {
              path: 'login',
              name: 'user-login',
              component: require('@/views/User/Login').default
            },
            {
              path: 'firstwrite',
              name: 'user-firstwrite',
              component: require('@/views/User/FirstWrite').default
            },
            {
              path: 'detail/:id',
              name: 'user-detail',
              component: require('@/views/User/Detail').default
            }
          ]
        },
        {
          path: '/customer',
          name: 'customer',
          component: require('@/views/Customer/Customer').default,
          children: [
            {
              path: '',
              name: 'customer-list',
              component: require('@/views/Customer/Index').default
            },
            {
              path: 'detail/:id',
              name: 'customer-detail',
              component: require('@/views/Customer/Detail').default
            }
          ]
        },
        {
          path: '/order',
          name: 'order',
          component: require('@/views/Order/Order').default,
          children: [
            {
              path: '',
              name: 'order-list',
              component: require('@/views/Order/Index').default
            },
            {
              path: 'detail/:id',
              name: 'order-detail',
              component: require('@/views/Order/Detail').default
            },
            {
              path: 'write',
              name: 'order-write',
              component: require('@/views/Order/Write').default
            }
          ]
        },
        {
          path: '/store',
          name: 'store',
          component: require('@/views/Store/Store').default,
          children: [
            {
              path: '',
              name: 'store-list',
              component: require('@/views/Store/Index').default
            }
          ]
        },
        {
          path: '/board',
          name: 'board',
          component: require('@/views/Board/Board').default,
          children: [
            {
              path: '',
              name: 'board-list',
              component: require('@/views/Board/Index').default
            },
            {
              path: 'detail/:id',
              name: 'board-detail',
              component: require('@/views/Board/Detail').default
            }
          ]
        },
        {
          path: '/schedule',
          name: 'schedule',
          component: require('@/views/Schedule/Schedule').default,
          children: [
            {
              path: '',
              name: 'schedule-list',
              component: require('@/views/Schedule/Index').default
            }
          ]
        },
        {
          path: '/trade',
          name: 'trade',
          component: require('@/views/Trade/Trade').default,
          children: [
            {
              path: '',
              name: 'trade-list',
              component: require('@/views/Trade/Index').default
            }
          ]
        }
      ]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
