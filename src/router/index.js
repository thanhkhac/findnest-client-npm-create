import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AboutView from '@/views/AboutView.vue'
import PostListView from '@/views/PostListView.vue'
import LoginView from '@/views/LoginView.vue'
import CreatePost from '@/views/CreatePost.vue'
import UpdatePost from '@/views/UpdatePost.vue'
import PostDetailView from '@/views/PostDetailView.vue'
import UserLayout from '@/layouts/UserLayout.vue'
import ProfileInfoView from '@/views/manage/ProfileInfoView.vue'
import DepositView from '@/views/manage/DepositView.vue'
import UserPostManage from '@/views/manage/UserPostManage.vue'
import ChangePasswordView from '@/views/manage/ChangePasswordView.vue'
import BuyPlan from '@/views/BuyPlan.vue'
import RegisterView from '@/views/RegisterView.vue'
import CreatePostRoomatePost from '@/views/CreatePostRoomatePost.vue'
import RoomatePostListView from '@/views/RoomatePostListView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: DefaultLayout,
      children: [
        { path: '/', component: PostListView },
        { path: 'about', component: AboutView },
        { path: 'search', component: PostListView },
        { path: 'login', component: LoginView },
        { path: 'register', component: RegisterView },
        { path: 'post/create', component: CreatePost },
        { path: 'roommate/post/create', component: CreatePostRoomatePost },
        { path: 'roommate', component: RoomatePostListView },
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
        { path: '/user/post/buy-plan/:id', component: BuyPlan },
        // ...
      ],
    },
  ],
})

export default router
