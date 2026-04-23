import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { LOCALE_CHANGED_EVENT, translate } from '@/i18n'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: { guest: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/auth/RegisterView.vue'),
    meta: { guest: true },
  },
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    redirect: '/home',
    children: [
      { path: 'home', name: 'Home', component: () => import('@/views/home/HomeView.vue'), meta: { title: '首页' } },
      { path: 'dashboard', name: 'Dashboard', component: () => import('@/views/dashboard/DashboardView.vue'), meta: { title: '我的工作台', requireAuth: true } },
      { path: 'companies', name: 'Companies', component: () => import('@/views/company/CompanyListView.vue'), meta: { title: '企业' } },
      { path: 'companies/:id', name: 'CompanyDetail', component: () => import('@/views/company/CompanyDetailView.vue'), meta: { title: '企业详情' } },
      { path: 'community', name: 'Community', component: () => import('@/views/community/CommunityView.vue'), meta: { title: '校园求职社区' } },
      { path: 'community/post/:id', name: 'PostDetail', component: () => import('@/views/community/PostDetailView.vue'), meta: { title: '帖子详情' } },
      { path: 'resumes', name: 'Resumes', component: () => import('@/views/resume/ResumeListView.vue'), meta: { title: '校园简历模板' } },
      { path: 'my-resumes', name: 'MyResumes', component: () => import('@/views/resume/MyResumesView.vue'), meta: { title: '我的简历', requireAuth: true } },
      { path: 'resume-edit/:id', name: 'ResumeEdit', component: () => import('@/views/resume/ResumeEditView.vue'), meta: { title: '编辑简历', requireAuth: true } },
      { path: 'jobs', name: 'Jobs', component: () => import('@/views/job/JobListView.vue'), meta: { title: '校招职位' } },
      { path: 'jobs/:id', name: 'JobDetail', component: () => import('@/views/job/JobDetailView.vue'), meta: { title: '职位详情' } },
      { path: 'applications', name: 'Applications', component: () => import('@/views/application/ApplicationListView.vue'), meta: { title: '校招投递追踪', requireAuth: true } },
      { path: 'interview', name: 'Interview', component: () => import('@/views/interview/InterviewView.vue'), meta: { title: 'AI 校招模拟面试', requireAuth: true } },
      { path: 'question-bank', name: 'QuestionBank', component: () => import('@/views/interview/QuestionBankView.vue'), meta: { title: '面试题库' } },
      { path: 'interview/:id', name: 'InterviewChat', component: () => import('@/views/interview/InterviewChatView.vue'), meta: { title: 'AI 面试对话', requireAuth: true } },
      { path: 'user-center/:tab?', name: 'UserCenter', component: () => import('@/views/profile/UserCenterView.vue'), meta: { title: '个人中心', requireAuth: true } },
      { path: 'profile', name: 'Profile', component: () => import('@/views/profile/ProfileView.vue'), meta: { title: '个人资料', requireAuth: true } },
      { path: 'chat', name: 'Chat', component: () => import('@/views/chat/ChatView.vue'), meta: { title: '消息沟通', requireAuth: true } },
      { path: 'notifications', name: 'Notifications', component: () => import('@/views/notification/NotificationView.vue'), meta: { title: '消息通知', requireAuth: true } },
      { path: 'enterprise-cert', name: 'EnterpriseCert', component: () => import('@/views/company/EnterpriseCertView.vue'), meta: { title: '校园招聘企业认证', requireAuth: true } },
      { path: 'about', name: 'About', component: () => import('@/views/about/AboutView.vue'), meta: { title: '关于我们' } },
    ],
  },
]

const router = createRouter({ history: createWebHistory(), routes })

router.beforeEach(async (to, _from, next) => {
  const token = localStorage.getItem('token')
  if (to.meta.guest && token) {
    next({ name: 'Home' })
  } else if (to.meta.requireAuth && !token) {
    next({ path: '/login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})

router.afterEach((to) => {
  const title = translate((to.meta?.title as string) || (to.name as string) || '')
  document.title = title ? `${title} - ${translate('AI 校园招聘平台')}` : translate('AI 校园招聘平台')
})

if (typeof window !== 'undefined') {
  window.addEventListener(LOCALE_CHANGED_EVENT, () => {
    const current = router.currentRoute.value
    const title = translate((current.meta?.title as string) || (current.name as string) || '')
    document.title = title ? `${title} - ${translate('AI 校园招聘平台')}` : translate('AI 校园招聘平台')
  })
}

export default router
