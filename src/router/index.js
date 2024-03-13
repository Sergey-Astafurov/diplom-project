import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/', component: Login, alias: '/',
    },
    {
      path: '/home', component: () => import('../views/HomePage.vue'),
      children: [
        {
          path: 'profile', component: () => import('../views/ProfilePage.vue')
        },
        {
          path: 'diary', component: () => import('../views/DiaryPage.vue')
        },
        {
          path: 'todo', component: () => import('../views/TodoPage.vue')
        }
      ]
    },
    {
      path: '/registration', component: () => import('../views/RegistrationPage.vue')
    },

  ]
})

export default router
