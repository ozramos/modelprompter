
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { name: 'system', path: '', component: () => import('pages/Channel.vue') }
    ]
  },

  {
    path: '/channel',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { name: 'channel', path: '/channel/:id', component: () => import('pages/Channel.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
