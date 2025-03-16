import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AboutView from '@/views/AboutView.vue'
import PostListView from '@/views/PostListView.vue'
import LoginView from '@/views/LoginView.vue'
import CreatePost from '@/views/CreatePost.vue'
import UpdatePost from '@/views/UpdatePost.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: DefaultLayout,
      children: [
        { path: '', component: HomeView },
        { path: 'about', component: AboutView },
        { path: 'search', component: PostListView },
        { path: 'login', component: LoginView },
        { path: 'post/create', component: CreatePost },
        { path: 'post/update', component: UpdatePost },
      ]
    },
  ],
})

export default router
