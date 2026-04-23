<template>
  <div class="page-shell flex gap-5 min-h-[70vh]">
    <!-- Left sidebar -->
    <div class="w-56 shrink-0">
      <div class="bg-white rounded-xl border border-gray-100 overflow-hidden sticky top-24">
        <!-- User card -->
        <div class="p-4 border-b border-gray-50">
          <div class="flex items-center gap-3">
            <img v-if="userStore.userInfo?.avatar" :src="userStore.userInfo.avatar" class="w-10 h-10 rounded-xl object-cover" />
            <div v-else class="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
              {{ (userStore.userInfo?.nickname || userStore.userInfo?.username || '用').charAt(0) }}
            </div>
            <div class="min-w-0">
              <div class="text-sm font-semibold text-gray-900 truncate">{{ userStore.userInfo?.nickname || userStore.userInfo?.username }}</div>
              <span class="text-xs text-gray-400">{{ roleLabel }}</span>
            </div>
          </div>
        </div>
        <!-- Menu items -->
        <nav class="py-1">
          <button
            v-for="item in menuItems"
            :key="item.key"
            @click="switchTab(item.key)"
            class="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors"
            :class="activeTab === item.key ? 'bg-blue-50 text-blue-600 font-medium border-r-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'"
          >
            <svg class="w-4.5 h-4.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" :d="item.icon" />
            </svg>
            {{ item.label }}
            <span v-if="item.badge" class="ml-auto text-xs bg-blue-600 text-white rounded-full px-1.5 py-0.5 leading-none">{{ item.badge }}</span>
          </button>
        </nav>
        <!-- Actions -->
        <div class="border-t border-gray-50 p-3">
          <button @click="userStore.logout()" class="w-full text-left px-3 py-2 text-sm text-gray-400 hover:text-red-500 transition-colors">{{ $t('退出登录') }}</button>
        </div>
      </div>
    </div>

    <!-- Right content -->
    <div class="flex-1 min-w-0">
      <!-- 个人资料 (内联编辑) -->
      <div v-if="activeTab === 'profile'" class="bg-white rounded-xl border border-gray-100 p-6">
        <div class="flex justify-between items-center mb-5">
          <h2 class="text-lg font-semibold text-gray-900">{{ $t('个人资料') }}</h2>
          <button v-if="!profileEditing" @click="startEditProfile" class="px-4 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">{{ $t('编辑') }}</button>
          <div v-else class="flex gap-2">
            <button @click="profileEditing = false" class="px-4 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500">{{ $t('取消') }}</button>
            <button @click="saveProfile" :disabled="profileSaving" class="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">{{ profileSaving ? $t('保存中...') : $t('保存') }}</button>
          </div>
        </div>
        <!-- Avatar -->
        <div class="flex items-center gap-4 mb-5">
          <div class="relative group">
            <img v-if="currentAvatar" :src="currentAvatar" class="w-16 h-16 rounded-2xl object-cover" />
            <div v-else class="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-xl font-bold">
              {{ (currentNickname || '用').charAt(0) }}
            </div>
            <label v-if="profileEditing" class="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white text-xs">
              {{ $t('上传') }}
              <input type="file" accept="image/jpeg,image/png,image/gif,image/webp" class="hidden" @change="onAvatarUpload" />
            </label>
          </div>
          <div v-if="profileEditing" class="text-xs text-gray-400">{{ $t('支持 jpg/png/gif/webp，最大 10MB') }}</div>
        </div>
        <!-- Fields -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs text-gray-400 mb-1">{{ $t('昵称') }}</label>
            <input v-if="profileEditing" v-model="profileForm.nickname" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            <p v-else class="text-sm text-gray-800">{{ userStore.userInfo?.nickname || '—' }}</p>
          </div>
          <div>
            <label class="block text-xs text-gray-400 mb-1">{{ $t('邮箱') }}</label>
            <input v-if="profileEditing" v-model="profileForm.email" type="email" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            <p v-else class="text-sm text-gray-800">{{ userStore.userInfo?.email || '—' }}</p>
          </div>
          <div>
            <label class="block text-xs text-gray-400 mb-1">{{ $t('手机号') }}</label>
            <input v-if="profileEditing" v-model="profileForm.phone" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            <p v-else class="text-sm text-gray-800">{{ userStore.userInfo?.phone || '—' }}</p>
          </div>
          <div>
            <label class="block text-xs text-gray-400 mb-1">{{ $t('性别') }}</label>
            <select v-if="profileEditing" v-model="profileForm.gender" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="">{{ $t('请选择') }}</option><option value="男">{{ $t('男') }}</option><option value="女">{{ $t('女') }}</option>
            </select>
            <p v-else class="text-sm text-gray-800">{{ userStore.userInfo?.gender || '—' }}</p>
          </div>
          <div>
            <label class="block text-xs text-gray-400 mb-1">{{ $t('学校') }}</label>
            <input v-if="profileEditing" v-model="profileForm.school" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            <p v-else class="text-sm text-gray-800">{{ userStore.userInfo?.school || '—' }}</p>
          </div>
          <div>
            <label class="block text-xs text-gray-400 mb-1">{{ $t('专业') }}</label>
            <input v-if="profileEditing" v-model="profileForm.major" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            <p v-else class="text-sm text-gray-800">{{ userStore.userInfo?.major || '—' }}</p>
          </div>
          <div>
            <label class="block text-xs text-gray-400 mb-1">{{ $t('毕业年份') }}</label>
            <input v-if="profileEditing" v-model.number="profileForm.graduationYear" type="number" min="1990" max="2030" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            <p v-else class="text-sm text-gray-800">{{ userStore.userInfo?.graduationYear || '—' }}</p>
          </div>
          <div>
            <label class="block text-xs text-gray-400 mb-1">{{ $t('学历') }}</label>
            <select v-if="profileEditing" v-model="profileForm.degree" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="">{{ $t('请选择') }}</option><option value="专科">{{ $t('专科') }}</option><option value="本科">{{ $t('本科') }}</option><option value="硕士">{{ $t('硕士') }}</option><option value="博士">{{ $t('博士') }}</option>
            </select>
            <p v-else class="text-sm text-gray-800">{{ userStore.userInfo?.degree || '—' }}</p>
          </div>
        </div>
        <div class="mt-4">
          <label class="block text-xs text-gray-400 mb-1">{{ $t('求职意向') }}</label>
          <input v-if="profileEditing" v-model="profileForm.jobIntention" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" :placeholder="$t('如 前端开发、产品经理')" />
          <p v-else class="text-sm text-gray-800">{{ userStore.userInfo?.jobIntention || '—' }}</p>
        </div>
      </div>

      <!-- 我的简历 -->
      <div v-if="activeTab === 'resumes'" class="bg-white rounded-xl border border-gray-100 p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold text-gray-900">{{ $t('我的简历') }}</h2>
          <div class="flex gap-2">
            <label class="px-4 py-1.5 text-sm border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 cursor-pointer">
              {{ $t('上传简历') }}
              <input type="file" accept=".pdf,.doc,.docx" class="hidden" @change="handleUploadResume" />
            </label>
            <button @click="showTemplateModal = true" class="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">{{ $t('从模板创建') }}</button>
          </div>
        </div>
        <div class="flex gap-1 mb-4 border-b border-gray-100">
          <button
            type="button"
            class="px-4 py-2 text-sm font-medium border-b-2 transition-colors"
            :class="resumeSubTab === 'saved' ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-400 hover:text-gray-600'"
            @click="resumeSubTab = 'saved'"
          >
            {{ $t('已保存') }} ({{ savedResumes.length }})
          </button>
          <button
            type="button"
            class="px-4 py-2 text-sm font-medium border-b-2 transition-colors"
            :class="resumeSubTab === 'drafts' ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-400 hover:text-gray-600'"
            @click="resumeSubTab = 'drafts'"
          >
            {{ $t('草稿') }} ({{ draftResumes.length }})
          </button>
        </div>
        <div v-if="filteredResumes.length === 0" class="text-center py-8 text-gray-400 text-sm">
          {{ resumeSubTab === 'drafts' ? $t('暂无草稿') : $t('暂无简历，点击"从模板创建"开始') }}
        </div>
        <div v-else class="space-y-3">
          <div
            v-for="r in filteredResumes" :key="r.id"
            class="flex justify-between items-center p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer"
            @click="renamingId !== r.id && $router.push(`/resume-edit/${r.id}`)"
          >
            <div class="min-w-0 flex-1">
              <div v-if="renamingId === r.id" class="flex items-center gap-2" @click.stop>
                <input
                  ref="renameInputRef"
                  v-model="renameTitle"
                  class="flex-1 px-2 py-1 text-sm border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  @keydown.enter="doRename(r)"
                  @keydown.esc="renamingId = null"
                />
                <button @click="doRename(r)" class="text-xs text-blue-600 hover:text-blue-700 font-medium">{{ $t('确认') }}</button>
                <button @click="renamingId = null" class="text-xs text-gray-400 hover:text-gray-600">{{ $t('取消') }}</button>
              </div>
              <div v-else class="text-sm font-medium text-gray-800">{{ r.title }}</div>
              <div class="text-xs text-gray-400 mt-0.5">
                {{ r.targetPosition ? r.targetPosition + ' · ' : '' }}{{ $t('更新于') }} {{ formatDate(r.updatedAt) }}
              </div>
            </div>
            <div class="flex items-center gap-2 shrink-0 ml-3">
              <span v-if="r.isDefault && !r.isDraft" class="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{{ $t('默认') }}</span>
              <button @click.stop="startRename(r)" class="text-xs text-gray-500 hover:text-blue-600">{{ $t('重命名') }}</button>
              <button @click.stop="$router.push(`/resume-edit/${r.id}`)" class="text-xs text-blue-600 hover:text-blue-700 font-medium">{{ $t('编辑') }}</button>
              <button @click.stop="handleDeleteResume(r)" class="text-xs text-gray-400 hover:text-red-500">{{ $t('删除') }}</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 模板选择弹窗 -->
      <div v-if="showTemplateModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" @click.self="showTemplateModal = false">
        <div class="bg-white rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto mx-4 shadow-xl">
          <div class="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center z-10">
            <h2 class="text-lg font-bold text-gray-900">{{ selectedTemplate ? $t('模板预览') : $t('新建简历') }}</h2>
            <button @click="selectedTemplate ? (selectedTemplate = null) : (showTemplateModal = false)" class="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
          </div>

          <!-- Template preview -->
          <div v-if="selectedTemplate" class="p-6">
            <div class="border border-gray-100 rounded-xl overflow-hidden mb-4 bg-gray-50">
              <iframe :srcdoc="buildFullPreview(selectedTemplate)" class="w-full h-[400px] border-none" sandbox="" />
            </div>
            <div class="flex justify-between items-center">
              <div>
                <h3 class="font-semibold text-gray-900">{{ selectedTemplate.name }}</h3>
                <span class="text-xs text-gray-400">{{ selectedTemplate.category || $t('通用') }}</span>
              </div>
              <div class="flex gap-2">
                <button @click="selectedTemplate = null" class="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">{{ $t('返回') }}</button>
                <button @click="createFromTemplate(selectedTemplate)" :disabled="creatingResume" class="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                  {{ creatingResume ? $t('创建中...') : $t('使用此模板创建') }}
                </button>
              </div>
            </div>
          </div>

          <!-- Template grid + upload -->
          <div v-else class="p-6">
            <!-- Upload section -->
            <div class="mb-6 p-4 border-2 border-dashed border-gray-200 rounded-xl hover:border-blue-300 transition-colors">
              <label class="flex items-center gap-4 cursor-pointer">
                <div class="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                  <svg class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
                </div>
                <div>
                  <div class="text-sm font-medium text-gray-800">{{ $t('上传简历文件') }}</div>
                  <div class="text-xs text-gray-400">{{ $t('支持 PDF / DOC / DOCX 格式') }}</div>
                </div>
                <input type="file" accept=".pdf,.doc,.docx" class="hidden" @change="handleUploadResume" />
              </label>
            </div>

            <div class="text-sm font-medium text-gray-700 mb-3">{{ $t('或选择模板创建') }}</div>
            <div v-if="templatesLoading" class="flex justify-center py-8">
              <div class="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
            <div v-else class="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div v-for="tpl in templates" :key="tpl.id"
                class="border border-gray-100 rounded-xl overflow-hidden hover:shadow-md hover:border-blue-200 cursor-pointer transition-all group"
                @click="selectedTemplate = tpl">
                <div class="h-28 bg-gray-50 flex items-center justify-center overflow-hidden">
                  <iframe v-if="tpl.htmlContent" :srcdoc="buildMiniPreview(tpl)" class="w-full h-full border-none pointer-events-none" sandbox="" />
                  <svg v-else class="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <div class="p-3">
                  <div class="text-sm font-medium text-gray-800 truncate group-hover:text-blue-600 transition-colors">{{ tpl.name }}</div>
                  <div class="text-xs text-gray-400 mt-0.5">{{ tpl.category || $t('通用') }}</div>
                </div>
              </div>
            </div>
            <div v-if="!templatesLoading && templates.length === 0" class="text-center py-8 text-gray-400 text-sm">{{ $t('暂无模板') }}</div>
          </div>
        </div>
      </div>

      <!-- 投递追踪 -->
      <div v-if="activeTab === 'applications'" class="bg-white rounded-xl border border-gray-100 p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold text-gray-900">{{ $t('投递追踪') }}</h2>
          <router-link to="/applications" class="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">{{ $t('查看全部') }}</router-link>
        </div>
        <div v-if="applications.length === 0" class="text-center py-8 text-gray-400 text-sm">{{ $t('暂无投递记录') }}</div>
        <div v-else class="space-y-3">
          <div v-for="a in applications" :key="a.id" class="flex justify-between items-center p-3 rounded-lg border border-gray-100 hover:border-blue-100 transition-colors">
            <div>
              <div class="text-sm font-medium text-gray-800">{{ a.company }} · {{ a.position }}</div>
              <div class="text-xs text-gray-400 mt-0.5">{{ formatDate(a.updatedAt) }}</div>
            </div>
            <span class="text-xs px-2 py-0.5 rounded-full" :class="statusClass(a.status)">{{ statusLabel(a.status) }}</span>
          </div>
        </div>
      </div>

      <!-- 面试练习 -->
      <div v-if="activeTab === 'interviews'" class="bg-white rounded-xl border border-gray-100 p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold text-gray-900">{{ $t('面试练习') }}</h2>
          <router-link to="/interview" class="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">{{ $t('开始练习') }}</router-link>
        </div>
        <div v-if="interviews.length === 0" class="text-center py-8 text-gray-400 text-sm">{{ $t('暂无面试记录') }}</div>
        <div v-else class="space-y-3">
          <div v-for="i in interviews" :key="i.id" class="flex justify-between items-center p-3 rounded-lg border border-gray-100 hover:border-blue-100 transition-colors">
            <div>
              <div class="text-sm font-medium text-gray-800">{{ i.jobTitle || $t('模拟面试') }}</div>
              <div class="text-xs text-gray-400 mt-0.5">{{ formatDate(i.createdAt) }}</div>
            </div>
            <div class="flex items-center gap-2">
              <span v-if="i.totalScore" class="text-sm font-semibold text-blue-600">{{ i.totalScore }}{{ $t('分') }}</span>
              <span class="px-1.5 py-0.5 text-[10px] rounded-full" :class="i.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'">
                {{ i.status === 'completed' ? $t('已完成') : $t('进行中') }}
              </span>
              <router-link :to="'/interview/' + i.id" class="px-3 py-1 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">{{ $t('进入查看') }}</router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- 收藏职位 -->
      <div v-if="activeTab === 'favorites'" class="bg-white rounded-xl border border-gray-100 p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold text-gray-900">{{ $t('收藏的职位') }}</h2>
          <button @click="fetchFavorites" class="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">{{ $t('刷新') }}</button>
        </div>
        <div v-if="favoritesLoading" class="text-center py-8 text-gray-400 text-sm">{{ $t('加载中...') }}</div>
        <div v-else-if="favoriteJobs.length === 0" class="text-center py-8 text-gray-400 text-sm">{{ $t('暂无收藏的职位') }}</div>
        <div v-else class="space-y-3">
          <div v-for="job in favoriteJobs" :key="job.id" class="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-colors">
            <div class="min-w-0 flex-1 cursor-pointer" @click="router.push('/jobs/' + job.id)">
              <div class="text-sm font-medium text-gray-900 truncate">{{ job.title }}</div>
              <div class="text-xs text-gray-500 mt-1">{{ job.companyName || $t('未知企业') }} · {{ job.location || $t('未知') }}</div>
              <div class="text-xs text-gray-400 mt-0.5">{{ $t('收藏于') }} {{ formatDate(job.favoritedAt) }}</div>
            </div>
            <div class="flex items-center gap-2 ml-3">
              <span v-if="job.salaryMin || job.salaryMax" class="text-sm font-medium text-blue-600">{{ job.salaryMin }}k-{{ job.salaryMax }}k</span>
              <button @click="removeFavorite(job.id)" class="p-1.5 text-gray-400 hover:text-red-500 transition-colors" :title="$t('取消收藏')">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 消息通知 -->
      <div v-if="activeTab === 'notifications'" class="bg-white rounded-xl border border-gray-100 p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold text-gray-900">{{ $t('消息通知') }}</h2>
          <router-link to="/notifications" class="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">{{ $t('查看全部') }}</router-link>
        </div>
        <div v-if="notifications.length === 0" class="text-center py-8 text-gray-400 text-sm">{{ $t('暂无消息') }}</div>
        <div v-else class="space-y-2">
          <div v-for="n in notifications" :key="n.id" class="p-3 rounded-lg hover:bg-gray-50 transition-colors" :class="{ 'bg-blue-50/50': !n.isRead }">
            <div class="text-sm text-gray-700" :class="{ 'font-medium': !n.isRead }">{{ n.content }}</div>
            <div class="text-xs text-gray-400 mt-1">{{ formatDate(n.createdAt) }}</div>
          </div>
        </div>
      </div>

      <!-- 企业申请记录 -->
      <div v-if="activeTab === 'enterprise'" class="bg-white rounded-xl border border-gray-100 p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold text-gray-900">{{ $t('申请记录') }}</h2>
          <router-link to="/enterprise-cert" class="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">{{ $t('管理认证') }}</router-link>
        </div>
        <div v-if="companyCertification" class="space-y-4">
          <div class="flex flex-wrap items-center gap-3">
            <div class="text-base font-semibold text-gray-900">{{ companyCertification.name }}</div>
            <span class="text-xs px-2.5 py-1 rounded-full" :class="companyStatusClass(companyCertification.status)">
              {{ companyStatusLabel(companyCertification.status) }}
            </span>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div class="rounded-lg bg-gray-50 p-4">
              <div class="text-xs text-gray-400 mb-1">{{ $t('申请时间') }}</div>
              <div class="text-sm text-gray-800">{{ formatDate(companyCertification.createdAt) }}</div>
            </div>
            <div class="rounded-lg bg-gray-50 p-4">
              <div class="text-xs text-gray-400 mb-1">{{ $t('最近更新') }}</div>
              <div class="text-sm text-gray-800">{{ formatDate(companyCertification.updatedAt) }}</div>
            </div>
            <div class="rounded-lg bg-gray-50 p-4">
              <div class="text-xs text-gray-400 mb-1">{{ $t('认证结果') }}</div>
              <div class="text-sm text-gray-800">{{ companyCertification.isVerified ? $t('已认证') : $t('待认证') }}</div>
            </div>
          </div>
          <div class="rounded-lg border border-gray-100 p-4">
            <div class="text-xs text-gray-400 mb-1">{{ $t('行业 / 城市') }}</div>
            <div class="text-sm text-gray-700">{{ companyCertification.industry || $t('未填写') }} · {{ companyCertification.city || $t('未填写') }}</div>
          </div>
          <div v-if="companyCertification.rejectReason" class="rounded-lg border border-red-100 bg-red-50 p-4">
            <div class="text-xs text-red-400 mb-1">{{ $t('审核反馈') }}</div>
            <div class="text-sm text-red-700 whitespace-pre-wrap">{{ companyCertification.rejectReason }}</div>
          </div>
          <div class="rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">
            {{ $t('企业账号不参与学生投递流程。你在这里看到的是自己的企业认证申请记录和审核状态。') }}
          </div>
        </div>
        <div v-else class="rounded-lg border border-dashed border-gray-200 p-6 text-sm text-gray-500">
          {{ $t('暂无企业认证申请记录，可前往企业认证页面提交申请。') }}
        </div>
      </div>
    </div>

    <div v-if="resumeUploading" class="fixed inset-0 z-[70] bg-black/45 backdrop-blur-[1px] flex items-center justify-center px-4">
      <div class="w-full max-w-md rounded-2xl bg-white shadow-xl border border-gray-100 p-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p class="text-sm font-semibold text-gray-800">
            {{ resumeUploadPhase === 'uploading' ? $t('正在上传文件…') : $t('正在 AI 分析简历…') }}
          </p>
        </div>
        <div class="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
          <div
            class="h-full rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 transition-all duration-500"
            :style="{ width: `${resumeUploadProgress}%` }"
          />
        </div>
        <div class="mt-2 text-xs text-gray-500 flex items-center justify-between">
          <span>{{ $t('预计需要 10-60 秒，请勿关闭页面') }}</span>
          <span>{{ resumeUploadProgress }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import request from '@/utils/request'
import { toast } from '@/utils/toast'
import { confirmDialog } from '@/utils/confirm'
import { useI18n } from '@/i18n'
import { getMyCompanyApi } from '@/api/company'
import { updateResumeApi } from '@/api/resume'

const router = useRouter()
const route = useRoute()
const { t, locale: currentLocale } = useI18n()
const userStore = useUserStore()

const VALID_TABS = ['profile', 'resumes', 'applications', 'favorites', 'interviews', 'notifications', 'enterprise']
const activeTab = computed(() => {
  const tab = route.params.tab as string
  return VALID_TABS.includes(tab) ? tab : 'profile'
})

function switchTab(key: string) {
  router.push(`/user-center/${key}`)
}

const roleLabel = computed(() => {
  const r = userStore.userInfo?.role
  if (r === 'admin') return '管理员'
  if (r === 'enterprise') return '企业'
  return '学生'
})
const isEnterprise = computed(() => userStore.userInfo?.role === 'enterprise')
const currentAvatar = computed(() => profileEditing.value ? profileForm.value.avatar : userStore.userInfo?.avatar)
const currentNickname = computed(() => profileEditing.value ? profileForm.value.nickname : (userStore.userInfo?.nickname || userStore.userInfo?.username))

const resumes = ref<any[]>([])
const resumeSubTab = ref<'saved' | 'drafts'>('saved')
const savedResumes = computed(() => resumes.value.filter((r: any) => !r.isDraft))
const draftResumes = computed(() => resumes.value.filter((r: any) => r.isDraft))
const filteredResumes = computed(() => resumeSubTab.value === 'drafts' ? draftResumes.value : savedResumes.value)
const applications = ref<any[]>([])
const interviews = ref<any[]>([])
const notifications = ref<any[]>([])
const companyCertification = ref<any>(null)

const showTemplateModal = ref(false)
const templates = ref<any[]>([])
const templatesLoading = ref(false)
const creatingResume = ref(false)
const selectedTemplate = ref<any>(null)
const resumeUploading = ref(false)
const resumeUploadPhase = ref<'uploading' | 'parsing'>('uploading')
const resumeUploadProgress = ref(0)
let resumeUploadTimer: ReturnType<typeof setInterval> | null = null

function stopResumeUploadTimer() {
  if (resumeUploadTimer) {
    clearInterval(resumeUploadTimer)
    resumeUploadTimer = null
  }
}

function startResumeParsingProgress() {
  resumeUploadPhase.value = 'parsing'
  resumeUploadProgress.value = Math.max(resumeUploadProgress.value, 72)
  stopResumeUploadTimer()
  resumeUploadTimer = setInterval(() => {
    if (resumeUploadProgress.value < 96) {
      resumeUploadProgress.value += 1
    }
  }, 400)
}

function resetResumeUploadState() {
  stopResumeUploadTimer()
  resumeUploadPhase.value = 'uploading'
  resumeUploadProgress.value = 0
}

const profileEditing = ref(false)
const profileSaving = ref(false)
const profileForm = ref<Record<string, any>>({})

const renamingId = ref<number | null>(null)
const renameTitle = ref('')
const renameInputRef = ref<HTMLInputElement | null>(null)

function startRename(r: any) {
  renamingId.value = r.id
  renameTitle.value = r.title
  nextTick(() => renameInputRef.value?.focus())
}

async function doRename(r: any) {
  const newTitle = renameTitle.value.trim()
  if (!newTitle) { toast(t('请填写简历标题'), 'warning'); return }
  try {
    await updateResumeApi(r.id, { title: newTitle })
    r.title = newTitle
    toast(t('已重命名'), 'success')
  } catch {}
  renamingId.value = null
}

function startEditProfile() {
  profileForm.value = { ...(userStore.userInfo || {}) }
  profileEditing.value = true
}

async function saveProfile() {
  profileSaving.value = true
  try {
    const { username, role, id, createdAt, updatedAt, isActive, avatar, password, lastOnlineAt, ...data } = profileForm.value
    await request.put('/user/profile', data)
    await userStore.fetchUserInfo()
    profileForm.value = { ...(userStore.userInfo || {}) }
    profileEditing.value = false
    toast(t('资料已更新'), 'success')
  } catch {} finally { profileSaving.value = false }
}

async function onAvatarUpload(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const fd = new FormData()
  fd.append('file', file)
  try {
    await request.post('/user/avatar', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    await userStore.fetchUserInfo()
    profileForm.value = { ...(userStore.userInfo || {}) }
    toast(t('头像已更新'), 'success')
  } catch {}
}

const favoriteJobs = ref<any[]>([])
const favoritesLoading = ref(false)

async function fetchFavorites() {
  favoritesLoading.value = true
  try {
    const res: any = await request.get('/jobs/favorites/my', { params: { pageSize: 50 } })
    const d = res.data ?? res
    favoriteJobs.value = d.list || d || []
  } catch { favoriteJobs.value = [] }
  finally { favoritesLoading.value = false }
}

async function removeFavorite(jobId: number) {
  try {
    await request.post(`/jobs/favorites/${jobId}/toggle`)
    favoriteJobs.value = favoriteJobs.value.filter(j => j.id !== jobId)
  } catch {}
}

const menuItems = computed(() => {
  const unread = notifications.value.filter(n => !n.isRead).length
  const items: { key: string; label: string; badge?: number; icon: string }[] = [
    { key: 'profile', label: t('个人资料'), icon: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z' },
  ]
  if (!isEnterprise.value) {
    items.push(
      { key: 'resumes', label: t('我的简历'), icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
      { key: 'applications', label: t('投递追踪'), icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
      { key: 'favorites', label: t('收藏职位'), icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
      { key: 'interviews', label: t('面试练习'), icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
    )
  } else {
    items.push(
      { key: 'enterprise', label: t('申请记录'), icon: 'M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 0h.008v.008h-.008V7.5z' },
    )
  }
  items.push(
    { key: 'notifications', label: t('消息通知'), badge: unread > 0 ? unread : undefined, icon: 'M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0' },
  )
  return items
})

function formatDate(d: string) {
  if (!d) return ''
  const date = new Date(d)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  if (diff < 60000) return t('刚刚')
  if (diff < 3600000) return `${Math.floor(diff / 60000)} ${t('分钟前')}`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} ${t('小时前')}`
  return date.toLocaleDateString('zh-CN')
}

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  pending: { label: '待筛选', cls: 'bg-gray-100 text-gray-600' },
  written_test: { label: '笔试', cls: 'bg-blue-50 text-blue-600' },
  first_interview: { label: '一面', cls: 'bg-indigo-50 text-indigo-600' },
  second_interview: { label: '二面', cls: 'bg-purple-50 text-purple-600' },
  hr_interview: { label: 'HR面', cls: 'bg-cyan-50 text-cyan-600' },
  offer: { label: 'Offer', cls: 'bg-emerald-50 text-emerald-600' },
  rejected: { label: '未通过', cls: 'bg-red-50 text-red-600' },
}
function statusLabel(s: string) { return STATUS_MAP[s]?.label || s }
function statusClass(s: string) { return STATUS_MAP[s]?.cls || 'bg-gray-100 text-gray-600' }
function companyStatusLabel(status?: string) {
  return {
    pending: '审核中',
    approved: '已通过',
    rejected: '审核未通过',
  }[status || ''] || (status || '未知')
}
function companyStatusClass(status?: string) {
  return {
    pending: 'bg-amber-50 text-amber-700',
    approved: 'bg-emerald-50 text-emerald-700',
    rejected: 'bg-red-50 text-red-700',
  }[status || ''] || 'bg-gray-100 text-gray-600'
}

function buildMiniPreview(tpl: any) {
  const css = (tpl.cssContent || '').replace(/<\/?script[^>]*>/gi, '')
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{margin:0;padding:8px;overflow:hidden;pointer-events:none;transform-origin:top left;transform:scale(0.2);width:700px}${css}</style></head><body>${tpl.htmlContent || ''}</body></html>`
}

async function fetchTemplates() {
  templatesLoading.value = true
  try {
    const res: any = await request.get('/resumes/templates', { params: { page: 1, pageSize: 50 } })
    templates.value = res.data?.list || res.data || []
  } catch { templates.value = [] }
  finally { templatesLoading.value = false }
}

async function createFromTemplate(tpl: any) {
  if (creatingResume.value) return
  creatingResume.value = true
  try {
    const res: any = await request.post('/resumes', {
      title: `${tpl.name} - 我的简历`,
      templateId: tpl.id,
      content: { basicInfo: {}, education: [], experience: [], projects: [], skills: [], selfIntro: '' },
    })
    const newId = res.data?.id || res.id
    showTemplateModal.value = false
    toast(t('简历已创建，进入编辑'), 'success')
    if (newId) router.push({ name: 'ResumeEdit', params: { id: newId } })
    else fetchData()
  } catch {} finally { creatingResume.value = false }
}

function buildFullPreview(tpl: any) {
  const css = (tpl.cssContent || '').replace(/<\/?script[^>]*>/gi, '')
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{margin:0;padding:30px}${css}</style></head><body>${tpl.htmlContent || ''}</body></html>`
}

async function handleUploadResume(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  resumeUploading.value = true
  resumeUploadPhase.value = 'uploading'
  resumeUploadProgress.value = 8
  try {
    const res: any = await request.post('/resumes', { title: file.name.replace(/\.(pdf|doc|docx)$/i, '') })
    const newId = res.data?.id || res.id
    if (newId) {
      const fd = new FormData()
      fd.append('file', file)
      await request.post(`/resumes/item/${newId}/upload`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 120000,
        params: currentLocale.value ? { locale: currentLocale.value } : undefined,
        onUploadProgress: (event) => {
          const total = event.total || file.size || 0
          if (total <= 0) return
          const percent = Math.min(100, Math.round((event.loaded / total) * 100))
          resumeUploadProgress.value = Math.max(8, Math.min(percent, 70))
          if (percent >= 100) startResumeParsingProgress()
        },
      })
      resumeUploadProgress.value = 100
      toast(t('简历已上传'), 'success')
      showTemplateModal.value = false
      router.push({ name: 'ResumeEdit', params: { id: newId } })
    }
  } catch {
    toast(t('上传失败，请重试'), 'error')
  } finally {
    resumeUploading.value = false
    resetResumeUploadState()
  }
}

async function handleDeleteResume(r: any) {
  const ok = await confirmDialog(t('确定删除简历「{title}」？此操作不可恢复。').replace('{title}', r.title), { title: t('删除简历'), kind: 'danger', confirmText: t('删除'), description: t('删除后你将无法使用该简历投递职位或开启面试。') })
  if (!ok) return
  try {
    await request.delete(`/resumes/${r.id}`)
    toast(t('已删除'), 'success')
    fetchData()
  } catch {}
}

async function fetchData() {
  if (!userStore.userInfo) {
    try { await userStore.fetchUserInfo() } catch {}
  }
  try {
    if (isEnterprise.value) {
      const [companyRes, notRes]: any[] = await Promise.allSettled([
        getMyCompanyApi(),
        request.get('/notifications', { params: { page: 1, pageSize: 10 } }),
      ])
      companyCertification.value = companyRes.status === 'fulfilled' ? (companyRes.value?.data || companyRes.value || null) : null
      notifications.value = notRes.status === 'fulfilled' ? (notRes.value?.data?.list || []) : []
      resumes.value = []
      applications.value = []
      interviews.value = []
      return
    }

    const [resRes, appRes, intRes, notRes]: any[] = await Promise.allSettled([
      request.get('/resumes'),
      request.get('/applications', { params: { page: 1, pageSize: 10 } }),
      request.get('/interview/list', { params: { page: 1, pageSize: 10 } }),
      request.get('/notifications', { params: { page: 1, pageSize: 10 } }),
    ])
    companyCertification.value = null
    if (resRes.status === 'fulfilled') resumes.value = Array.isArray(resRes.value?.data) ? resRes.value.data : (resRes.value?.data?.list || [])
    if (appRes.status === 'fulfilled') applications.value = appRes.value?.data?.list || []
    if (intRes.status === 'fulfilled') interviews.value = intRes.value?.data?.list || []
    if (notRes.status === 'fulfilled') notifications.value = notRes.value?.data?.list || []
  } catch {}
}

watch(activeTab, (tab) => {
  if (tab === 'favorites' && favoriteJobs.value.length === 0) fetchFavorites()
})

onMounted(async () => {
  await fetchData()
  fetchTemplates()
  if (isEnterprise.value && !route.params.tab) {
    router.replace('/user-center/enterprise')
  } else if (!route.params.tab) {
    router.replace('/user-center/profile')
  }
})
</script>
