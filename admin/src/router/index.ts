import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/user'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/LoginView.vue'),
    meta: { title: '登录', requiresAuth: false },
  },
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/layouts/BasicLayout.vue'),
    redirect: '/dashboard',
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/DashboardView.vue'),
        meta: { title: '仪表盘', icon: 'DashboardOutlined' },
      },
      {
        path: 'users',
        name: 'UserManage',
        component: () => import('@/views/user/UserManage.vue'),
        meta: { title: '用户管理', icon: 'TeamOutlined', roles: ['admin'] },
      },
      {
        path: 'audit',
        name: 'Audit',
        component: () => import('@/views/audit/AuditView.vue'),
        meta: { title: '入驻审核', icon: 'SafetyCertificateOutlined', roles: ['admin'] },
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/profile/ProfileView.vue'),
        meta: { title: '个人资料', icon: 'UserOutlined' },
      },
      {
        path: 'community/posts',
        name: 'PostManage',
        component: () => import('@/views/community/PostManage.vue'),
        meta: { title: '帖子管理', icon: 'MessageOutlined', roles: ['admin'], parent: 'community' },
      },
      {
        path: 'community/comments',
        name: 'CommentManage',
        component: () => import('@/views/community/CommentManage.vue'),
        meta: { title: '评论管理', icon: 'CommentOutlined', roles: ['admin'], parent: 'community' },
      },
      {
        path: 'community/categories',
        name: 'CategoryManage',
        component: () => import('@/views/community/CategoryManage.vue'),
        meta: { title: '分类管理', icon: 'AppstoreOutlined', roles: ['admin'], parent: 'community' },
      },
      {
        path: 'resumes/templates',
        name: 'TemplateManage',
        component: () => import('@/views/resume/TemplateManage.vue'),
        meta: { title: '模板管理', icon: 'LayoutOutlined', roles: ['admin'], parent: 'resume' },
      },
      {
        path: 'resumes/categories',
        name: 'TemplateCategoryManage',
        component: () => import('@/views/resume/TemplateCategoryManage.vue'),
        meta: { title: '分类管理', icon: 'AppstoreOutlined', roles: ['admin'], parent: 'resume' },
      },
      {
        path: 'resumes/admin',
        name: 'ResumeAdmin',
        component: () => import('@/views/resume/ResumeAdminView.vue'),
        meta: { title: '简历管理', icon: 'SolutionOutlined', roles: ['admin'], parent: 'resume' },
      },
      {
        path: 'resumes/manage',
        name: 'ResumeManage',
        component: () => import('@/views/resume/ResumeManage.vue'),
        meta: { title: '简历详情管理', icon: 'FileSearchOutlined', roles: ['admin'], parent: 'resume' },
      },
      
      {
        path: 'jobs',
        name: 'JobManage',
        component: () => import('@/views/job/JobManage.vue'),
        meta: { title: '职位管理', icon: 'SolutionOutlined', roles: ['admin'], parent: 'recruitment' },
      },
      {
        path: 'companies',
        name: 'CompanyManage',
        component: () => import('@/views/company/CompanyManage.vue'),
        meta: { title: '企业管理', icon: 'BankOutlined', roles: ['admin'], parent: 'recruitment' },
      },
      {
        path: 'applications',
        name: 'ApplicationManage',
        component: () => import('@/views/application/ApplicationManage.vue'),
        meta: { title: '投递管理', icon: 'SendOutlined', roles: ['admin'], parent: 'recruitment' },
      },
      {
        path: 'interview/questions',
        name: 'QuestionManage',
        component: () => import('@/views/interview/QuestionManage.vue'),
        meta: { title: '题库管理', icon: 'BulbOutlined', roles: ['admin'], parent: 'interview' },
      },
      {
        path: 'interview/categories',
        name: 'InterviewCategoryManage',
        component: () => import('@/views/interview/CategoryManageInterview.vue'),
        meta: { title: '分类管理', icon: 'ApartmentOutlined', roles: ['admin'], parent: 'interview' },
      },
      {
        path: 'interview/records',
        name: 'InterviewRecordManage',
        component: () => import('@/views/interview/InterviewRecordManage.vue'),
        meta: { title: '面试记录', icon: 'FileTextOutlined', roles: ['admin'], parent: 'interview' },
      },
      {
        path: 'notifications',
        name: 'Notifications',
        component: () => import('@/views/notification/NotificationView.vue'),
        meta: { title: '消息通知', icon: 'BellOutlined' },
      },
      {
        path: 'system/announcement',
        name: 'AnnouncementManage',
        component: () => import('@/views/system/AnnouncementManage.vue'),
        meta: { title: '公告管理', icon: 'NotificationOutlined', roles: ['admin'], parent: 'system' },
      },
      {
        path: 'system/settings',
        name: 'SystemSettings',
        component: () => import('@/views/system/SettingsView.vue'),
        meta: { title: '系统设置', icon: 'SettingOutlined', roles: ['admin'], parent: 'system' },
      },
      {
        path: 'system/dict',
        name: 'DictManage',
        component: () => import('@/views/system/DictManage.vue'),
        meta: { title: '数据字典', icon: 'DatabaseOutlined', roles: ['admin'], parent: 'system' },
      },
      {
        path: 'system/ai-config',
        redirect: '/system/ai-config/key',
      },
      {
        path: 'system/ai-config/key',
        name: 'AiConfigKey',
        component: () => import('@/views/system/AiConfigKeyView.vue'),
        meta: { title: '配置 KEY', icon: 'KeyOutlined', roles: ['admin'], parent: 'ai-config' },
      },
      {
        path: 'system/ai-config/billing',
        name: 'AiConfigBilling',
        component: () => import('@/views/system/AiConfigBillingView.vue'),
        meta: { title: '用量账单', icon: 'AccountBookOutlined', roles: ['admin'], parent: 'ai-config' },
      },
      {
        path: 'system/ai-config/logs',
        name: 'AiConfigLogs',
        component: () => import('@/views/system/AiConfigLogView.vue'),
        meta: { title: '调用日志', icon: 'FileTextOutlined', roles: ['admin'], parent: 'ai-config' },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

/* 路由守卫 — 登录与权限校验 */
router.beforeEach(async (to, _from, next) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth !== false && !token) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else if (to.name === 'Login' && token) {
    try {
      const userStore = useUserStore()
      if (!userStore.userInfo) await userStore.fetchUserInfo()
      next({ name: 'Dashboard' })
    } catch {
      localStorage.removeItem('token')
      next()
    }
  } else if (token && to.meta.roles) {
    const userStore = useUserStore()
    if (!userStore.userInfo) {
      try {
        await userStore.fetchUserInfo()
      } catch {
        localStorage.removeItem('token')
        next({ name: 'Login', query: { redirect: to.fullPath } })
        return
      }
    }
    const roles = to.meta.roles as string[]
    if (roles.includes(userStore.userInfo?.role as string)) {
      next()
    } else {
      next({ name: 'Dashboard' })
    }
  } else {
    next()
  }
})

router.afterEach((to) => {
  document.title = (to.meta?.title as string) || '校园招聘管理后台'
})

export default router
