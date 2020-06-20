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
