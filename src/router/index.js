import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AboutView from '@/views/AboutView.vue'
import PostListView from '@/views/PostListView.vue'
import LoginView from '@/views/LoginView.vue'
import CreatePost from '@/views/CreatePost.vue'
import UpdatePost from '@/views/UpdatePost.vue'
import PostDetail from '@/components/PostDetail.vue'
import PostDetailView from '@/views/PostDetailView.vue'
import UserLayout from '@/layouts/UserLayout.vue'
import ProfileInfoView from '@/views/manage/ProfileInfoView.vue'
import DepositView from '@/views/manage/DepositView.vue'
import UserPostManage from '@/views/manage/UserPostManage.vue'
import ChangePasswordView from '@/views/manage/ChangePasswordView.vue'

const router = createRouter({
  history: createWebHashHistory(),
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
        { path: 'post/update/:id', component: UpdatePost },
        { path: 'post/detail/:id', component: PostDetailView },
      ]
    },
    {
      path: '/profile',
      component: UserLayout,
      children: [
        { path: '', component: ProfileInfoView },
        { path: '/deposit', component: DepositView },
        { path: '/user/post', component: UserPostManage },
        { path: '/user/password', component: ChangePasswordView },
        // ...
      ],
    },
  ],
})

export default router
