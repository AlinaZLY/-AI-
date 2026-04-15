<template>
  <div class="min-h-screen bg-slate-50">
    <div class="max-w-6xl mx-auto px-4 py-6">
      <!-- Header -->
      <div class="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div class="flex items-center gap-4">
          <h1 class="text-2xl font-bold text-slate-800">校招投递追踪</h1>
          <div class="flex bg-slate-100 rounded-lg p-0.5">
            <button @click="viewMode = 'list'" :class="viewMode === 'list' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'" class="px-3 py-1.5 text-sm font-medium rounded-md transition-all">列表</button>
            <button @click="viewMode = 'calendar'; fetchCalendar()" :class="viewMode === 'calendar' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'" class="px-3 py-1.5 text-sm font-medium rounded-md transition-all">日历</button>
          </div>
        </div>
        <button
          @click="openCreateModal"
          class="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
        >
          + 新增投递
        </button>
      </div>

      <!-- Calendar View -->
      <div v-if="viewMode === 'calendar'" class="bg-white rounded-xl border border-slate-100 shadow-sm p-6 mb-6">
        <div class="flex justify-between items-center mb-4">
          <button @click="changeMonth(-1)" class="px-3 py-1.5 text-sm border border-slate-200 rounded-lg hover:bg-slate-50">&lt; 上月</button>
          <h2 class="text-lg font-semibold text-slate-800">{{ calendarYear }}年{{ calendarMonth }}月</h2>
          <button @click="changeMonth(1)" class="px-3 py-1.5 text-sm border border-slate-200 rounded-lg hover:bg-slate-50">下月 &gt;</button>
        </div>
        <div class="grid grid-cols-7 gap-px bg-slate-200 rounded-lg overflow-hidden">
          <div v-for="d in ['一','二','三','四','五','六','日']" :key="d" class="bg-slate-50 py-2 text-center text-xs font-medium text-slate-500">周{{ d }}</div>
          <div v-for="(day, i) in calendarDays" :key="i" class="bg-white min-h-[80px] p-1.5" :class="day.isCurrentMonth ? '' : 'opacity-30'">
            <div class="text-xs font-medium mb-1" :class="day.isToday ? 'text-indigo-600 font-bold' : 'text-slate-600'">{{ day.date }}</div>
            <div v-for="evt in day.events" :key="evt.id" class="text-[11px] px-1.5 py-0.5 mb-0.5 rounded bg-indigo-50 text-indigo-700 truncate cursor-pointer hover:bg-indigo-100" :title="`${evt.company} - ${evt.position}`">
              {{ evt.company }}
            </div>
          </div>
        </div>
        <div v-if="calendarEvents.length === 0" class="text-center py-8 text-slate-400 text-sm">本月暂无面试安排</div>
      </div>

      <!-- Stats cards -->
      <div v-if="viewMode === 'list'" class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
        <div class="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
          <div class="text-sm text-slate-500">全部</div>
          <div class="text-xl font-bold text-slate-800 mt-1">{{ stats.total }}</div>
        </div>
        <div
          v-for="s in statsByStatus"
          :key="s.status"
          class="bg-white rounded-xl p-4 border border-slate-100 shadow-sm cursor-pointer transition-all hover:border-indigo-200"
          :class="{ 'ring-2 ring-indigo-500': filters.status === s.status }"
          @click="toggleStatusFilter(s.status)"
        >
          <div class="text-sm text-slate-500 truncate">{{ statusLabel(s.status) }}</div>
          <div class="text-xl font-bold text-slate-800 mt-1">{{ s.count }}</div>
        </div>
        <div
          v-for="t in statsByTag"
          :key="t.tag"
          class="bg-white rounded-xl p-4 border border-slate-100 shadow-sm cursor-pointer transition-all hover:border-indigo-200"
          :class="{ 'ring-2 ring-indigo-500': filters.tag === t.tag }"
          @click="toggleTagFilter(t.tag)"
        >
          <div class="text-sm text-slate-500 truncate">{{ tagLabel(t.tag) }}</div>
          <div class="text-xl font-bold text-slate-800 mt-1">{{ t.count }}</div>
        </div>
      </div>

      <!-- Search & filter -->
      <div class="bg-white rounded-xl p-4 border border-slate-100 shadow-sm mb-6">
        <div class="flex flex-wrap gap-3 items-end">
          <div class="flex-1 min-w-[180px]">
            <label class="block text-sm font-medium text-slate-600 mb-1">关键词</label>
            <input
              v-model="filters.keyword"
              placeholder="公司/岗位"
              class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              @keyup.enter="fetchList"
            />
          </div>
          <div class="w-36">
            <label class="block text-sm font-medium text-slate-600 mb-1">状态</label>
            <select
              v-model="filters.status"
              class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="">全部</option>
              <option v-for="s in statusOptions" :key="s.value" :value="s.value">{{ s.label }}</option>
            </select>
          </div>
          <div class="w-36">
            <label class="block text-sm font-medium text-slate-600 mb-1">标签</label>
            <select
              v-model="filters.tag"
              class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="">全部</option>
              <option v-for="t in tagOptions" :key="t.value" :value="t.value">{{ t.label }}</option>
            </select>
          </div>
          <button
            @click="page = 1; fetchList()"
            class="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
          >
            搜索
          </button>
          <button
            @click="resetFilters"
            class="px-4 py-2 text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 text-sm"
          >
            重置
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-16">
        <div class="animate-spin w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>

      <!-- Application cards -->
      <div v-else class="space-y-3">
        <div
          v-for="app in applications"
          :key="app.id"
          class="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden transition-all hover:shadow-md"
        >
          <div
            class="p-5 cursor-pointer"
            @click="toggleExpand(app.id)"
          >
            <div class="flex flex-wrap justify-between items-start gap-3">
              <div class="flex-1 min-w-0">
                <h3 class="font-semibold text-slate-900 text-lg">{{ app.company }} · {{ app.position }}</h3>
                <div class="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-slate-500">
                  <span>{{ app.channel || '-' }}</span>
                  <span>{{ app.salaryRange || '-' }}</span>
                  <span>{{ app.location || '-' }}</span>
                  <span v-if="app.nextDate">下次: {{ formatDate(app.nextDate) }}</span>
                  <span>更新: {{ formatTime(app.updatedAt) }}</span>
                </div>
              </div>
              <div class="flex items-center gap-2 flex-shrink-0">
                <span
                  :class="statusBadgeClass(app.status)"
                  class="px-3 py-1 rounded-full text-xs font-medium"
                >
                  {{ statusLabel(app.status) }}
                </span>
                <span
                  :class="tagBadgeClass(app.tag)"
                  class="px-3 py-1 rounded-full text-xs font-medium"
                >
                  {{ tagLabel(app.tag) }}
                </span>
                <select
                  :value="app.status"
                  class="text-xs border border-slate-200 rounded px-2 py-1 bg-white"
                  @change="(e) => changeStatus(app, (e.target as HTMLSelectElement).value)"
                  @click.stop
                >
                  <option v-for="s in statusOptions" :key="s.value" :value="s.value">{{ s.label }}</option>
                </select>
                <button
                  @click.stop="openEditModal(app)"
                  class="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded"
                  title="编辑"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </button>
                <button
                  @click.stop="confirmDelete(app)"
                  class="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                  title="删除"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Expanded detail -->
          <div v-if="expandedId === app.id" class="border-t border-slate-100 bg-slate-50/50 p-5">
            <div class="grid md:grid-cols-2 gap-6">
              <!-- Timeline -->
              <div>
                <h4 class="text-sm font-semibold text-slate-700 mb-3">状态时间线</h4>
                <div v-if="loadingLogs[app.id]" class="text-sm text-slate-400">加载中...</div>
                <div v-else-if="!logsMap[app.id]?.length" class="text-sm text-slate-400">暂无记录</div>
                <div v-else class="space-y-2">
                  <div
                    v-for="(log, i) in logsMap[app.id]"
                    :key="log.id"
                    class="flex gap-3"
                  >
                    <div class="flex flex-col items-center">
                      <div class="w-2.5 h-2.5 rounded-full bg-indigo-500" :class="{ 'bg-slate-300': i === logsMap[app.id].length - 1 }"></div>
                      <div v-if="i < logsMap[app.id].length - 1" class="w-0.5 flex-1 bg-slate-200 min-h-[8px]"></div>
                    </div>
                    <div class="flex-1 pb-3">
                      <div class="text-sm text-slate-700">{{ statusLabel(log.fromStatus) }} → {{ statusLabel(log.toStatus) }}</div>
                      <div v-if="log.note" class="text-xs text-slate-500 mt-0.5">{{ log.note }}</div>
                      <div class="text-xs text-slate-400 mt-1">{{ formatTime(log.createdAt) }}</div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Notes -->
              <div>
                <h4 class="text-sm font-semibold text-slate-700 mb-3">备注</h4>
                <div class="flex gap-2 mb-3">
                  <input
                    v-model="newNoteContent[app.id]"
                    placeholder="添加备注..."
                    class="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm"
                    @keyup.enter="addNote(app)"
                  />
                  <button
                    @click="addNote(app)"
                    class="px-3 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
                  >
                    添加
                  </button>
                </div>
                <div v-if="loadingNotes[app.id]" class="text-sm text-slate-400">加载中...</div>
                <div v-else-if="!notesMap[app.id]?.length" class="text-sm text-slate-400">暂无备注</div>
                <div v-else class="space-y-2">
                  <div
                    v-for="note in notesMap[app.id]"
                    :key="note.id"
                    class="flex justify-between gap-2 bg-white rounded-lg p-3 border border-slate-100"
                  >
                    <p class="text-sm text-slate-700 flex-1">{{ note.content }}</p>
                    <div class="flex items-center gap-1 flex-shrink-0">
                      <span class="text-xs text-slate-400">{{ formatTime(note.createdAt) }}</span>
                      <button
                        @click="deleteNote(app, note.id)"
                        class="p-1 text-slate-400 hover:text-red-600"
                      >
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!loading && applications.length === 0" class="text-center py-16">
        <template v-if="!isLoggedIn">
          <p class="text-slate-500 mb-4">登录后可以记录和追踪投递进度</p>
          <div class="flex justify-center gap-3">
            <router-link to="/login" class="px-5 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700">立即登录</router-link>
            <router-link to="/register" class="px-5 py-2 border border-slate-200 text-slate-600 text-sm rounded-lg hover:bg-slate-50">注册账号</router-link>
          </div>
        </template>
        <p v-else class="text-slate-400">暂无投递记录</p>
      </div>

      <!-- Pagination -->
      <div v-if="total > pageSize" class="flex justify-center gap-2 mt-6">
        <button
          :disabled="page <= 1"
          @click="page = Math.max(1, page - 1); fetchList()"
          class="px-4 py-2 border border-slate-200 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
        >
          上一页
        </button>
        <span class="px-4 py-2 text-sm text-slate-600">
          {{ page }} / {{ Math.ceil(total / pageSize) }}
        </span>
        <button
          :disabled="page >= Math.ceil(total / pageSize)"
          @click="page = Math.min(Math.ceil(total / pageSize), page + 1); fetchList()"
          class="px-4 py-2 border border-slate-200 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
        >
          下一页
        </button>
      </div>
    </div>

    <!-- Create modal -->
    <div v-if="showCreate" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" @click.self="showCreate = false">
      <div class="bg-white rounded-2xl w-full max-w-lg shadow-xl">
        <div class="flex justify-between items-center p-6 border-b border-slate-100">
          <h2 class="text-lg font-bold text-slate-900">新增投递记录</h2>
          <button @click="showCreate = false" class="text-slate-400 hover:text-slate-600 text-2xl leading-none">&times;</button>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">公司名称 <span class="text-red-500">*</span></label>
            <input v-model="form.company" placeholder="如：字节跳动" class="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">岗位名称 <span class="text-red-500">*</span></label>
            <input v-model="form.position" placeholder="如：前端开发工程师" class="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">投递渠道</label>
              <input v-model="form.channel" placeholder="如：官网/Boss直聘" class="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">薪资范围</label>
              <input v-model="form.salaryRange" placeholder="如：15-25k" class="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">工作地点</label>
            <input v-model="form.location" placeholder="如：北京" class="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">岗位描述</label>
            <textarea v-model="form.jobDescription" rows="3" placeholder="岗位要求（可选）" class="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"></textarea>
          </div>
        </div>
        <div class="flex justify-end gap-2 p-6 border-t border-slate-100">
          <button @click="showCreate = false" class="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">取消</button>
          <button
            @click="handleCreate"
            :disabled="!form.company.trim() || !form.position.trim() || submitting"
            class="px-4 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ submitting ? '提交中...' : '提交' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Edit modal -->
    <div v-if="showEdit" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" @click.self="showEdit = false">
      <div class="bg-white rounded-2xl w-full max-w-lg shadow-xl">
        <div class="flex justify-between items-center p-6 border-b border-slate-100">
          <h2 class="text-lg font-bold text-slate-900">编辑投递记录</h2>
          <button @click="showEdit = false" class="text-slate-400 hover:text-slate-600 text-2xl leading-none">&times;</button>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">公司名称 <span class="text-red-500">*</span></label>
            <input v-model="editForm.company" placeholder="如：字节跳动" class="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">岗位名称 <span class="text-red-500">*</span></label>
            <input v-model="editForm.position" placeholder="如：前端开发工程师" class="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">投递渠道</label>
              <input v-model="editForm.channel" placeholder="如：官网/Boss直聘" class="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">薪资范围</label>
              <input v-model="editForm.salaryRange" placeholder="如：15-25k" class="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">工作地点</label>
            <input v-model="editForm.location" placeholder="如：北京" class="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">下次日期</label>
            <input v-model="editForm.nextDate" type="date" class="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">备注</label>
            <textarea v-model="editForm.remark" rows="3" placeholder="备注" class="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"></textarea>
          </div>
        </div>
        <div class="flex justify-end gap-2 p-6 border-t border-slate-100">
          <button @click="showEdit = false" class="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">取消</button>
          <button
            @click="handleEdit"
            :disabled="!editForm.company.trim() || !editForm.position.trim() || submitting"
            class="px-4 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ submitting ? '保存中...' : '保存' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Delete confirmation -->
    <div v-if="deleteTarget" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" @click.self="deleteTarget = null">
      <div class="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl">
        <h3 class="text-lg font-semibold text-slate-900 mb-2">确认删除</h3>
        <p class="text-slate-600 text-sm mb-4">确定要删除「{{ deleteTarget.company }} · {{ deleteTarget.position }}」的投递记录吗？此操作不可恢复。</p>
        <div class="flex justify-end gap-2">
          <button @click="deleteTarget = null" class="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">取消</button>
          <button
            @click="handleDelete"
            class="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700"
          >
            删除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import request from '@/utils/request'
import toast from '@/utils/toast'
import { getApplicationCalendarApi } from '@/api/application'

const isLoggedIn = computed(() => !!localStorage.getItem('token'))
const viewMode = ref<'list' | 'calendar'>('list')
const calendarYear = ref(new Date().getFullYear())
const calendarMonth = ref(new Date().getMonth() + 1)
const calendarEvents = ref<any[]>([])

interface CalendarDay {
  date: number
  isCurrentMonth: boolean
  isToday: boolean
  events: any[]
}

const calendarDays = computed<CalendarDay[]>(() => {
  const y = calendarYear.value, m = calendarMonth.value
  const firstDay = new Date(y, m - 1, 1)
  const lastDay = new Date(y, m, 0)
  const startDow = (firstDay.getDay() + 6) % 7
  const days: CalendarDay[] = []
  const today = new Date()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  for (let i = startDow - 1; i >= 0; i--) {
    const d = new Date(y, m - 1, -i)
    days.push({ date: d.getDate(), isCurrentMonth: false, isToday: false, events: [] })
  }
  for (let d = 1; d <= lastDay.getDate(); d++) {
    const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    days.push({
      date: d, isCurrentMonth: true, isToday: dateStr === todayStr,
      events: calendarEvents.value.filter(e => e.nextDate?.startsWith(dateStr)),
    })
  }
  const remaining = 7 - (days.length % 7)
  if (remaining < 7) {
    for (let i = 1; i <= remaining; i++) {
      days.push({ date: i, isCurrentMonth: false, isToday: false, events: [] })
    }
  }
  return days
})

function changeMonth(delta: number) {
  calendarMonth.value += delta
  if (calendarMonth.value > 12) { calendarMonth.value = 1; calendarYear.value++ }
  if (calendarMonth.value < 1) { calendarMonth.value = 12; calendarYear.value-- }
  fetchCalendar()
}

async function fetchCalendar() {
  const y = calendarYear.value, m = calendarMonth.value
  const startDate = `${y}-${String(m).padStart(2, '0')}-01`
  const lastDay = new Date(y, m, 0).getDate()
  const endDate = `${y}-${String(m).padStart(2, '0')}-${lastDay}`
  try {
    const res: any = await getApplicationCalendarApi({ startDate, endDate })
    calendarEvents.value = res.data || res || []
  } catch {
    calendarEvents.value = []
  }
}

const STATUS_OPTIONS = [
  { value: 'pending', label: '待筛选' },
  { value: 'written_test', label: '笔试' },
  { value: 'first_interview', label: '一面' },
  { value: 'second_interview', label: '二面' },
  { value: 'hr_interview', label: 'HR面' },
  { value: 'offer', label: 'Offer' },
  { value: 'rejected', label: '拒信' },
]
const TAG_OPTIONS = [
  { value: 'in_progress', label: '进行中' },
  { value: 'passed', label: '已通过' },
  { value: 'failed', label: '已失败' },
  { value: 'abandoned', label: '已放弃' },
]

interface Application {
  id: number
  company: string
  position: string
  channel?: string
  salaryRange?: string
  location?: string
  status: string
  tag: string
  nextDate?: string
  remark?: string
  updatedAt: string
}

interface StatusLog {
  id: number
  fromStatus: string
  toStatus: string
  note?: string
  createdAt: string
}

interface ApplicationNote {
  id: number
  content: string
  createdAt: string
}

interface Stats {
  total: number
  byStatus: { status: string; count: string }[]
  byTag: { tag: string; count: string }[]
}

const applications = ref<Application[]>([])
const stats = ref<Stats>({ total: 0, byStatus: [], byTag: [] })
const loading = ref(false)
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const expandedId = ref<number | null>(null)
const logsMap = ref<Record<number, StatusLog[]>>({})
const notesMap = ref<Record<number, ApplicationNote[]>>({})
const loadingLogs = ref<Record<number, boolean>>({})
const loadingNotes = ref<Record<number, boolean>>({})
const newNoteContent = ref<Record<number, string>>({})
const showCreate = ref(false)
const showEdit = ref(false)
const submitting = ref(false)
const deleteTarget = ref<Application | null>(null)
const editId = ref<number | null>(null)

const filters = reactive({
  keyword: '',
  status: '',
  tag: '',
})

const form = reactive({
  company: '',
  position: '',
  channel: '',
  salaryRange: '',
  location: '',
  jobDescription: '',
})

const editForm = reactive({
  company: '',
  position: '',
  channel: '',
  salaryRange: '',
  location: '',
  nextDate: '',
  remark: '',
})

const statusOptions = STATUS_OPTIONS
const tagOptions = TAG_OPTIONS

const statsByStatus = ref<{ status: string; count: number }[]>([])
const statsByTag = ref<{ tag: string; count: number }[]>([])

function statusLabel(s: string) {
  return STATUS_OPTIONS.find((o) => o.value === s)?.label ?? s
}
function tagLabel(t: string) {
  return TAG_OPTIONS.find((o) => o.value === t)?.label ?? t
}
function statusBadgeClass(s: string) {
  const map: Record<string, string> = {
    pending: 'bg-amber-50 text-amber-700',
    written_test: 'bg-blue-50 text-blue-700',
    first_interview: 'bg-cyan-50 text-cyan-700',
    second_interview: 'bg-teal-50 text-teal-700',
    hr_interview: 'bg-indigo-50 text-indigo-700',
    offer: 'bg-emerald-50 text-emerald-700',
    rejected: 'bg-red-50 text-red-700',
  }
  return map[s] ?? 'bg-slate-100 text-slate-600'
}
function tagBadgeClass(t: string) {
  const map: Record<string, string> = {
    in_progress: 'bg-blue-50 text-blue-600',
    passed: 'bg-green-50 text-green-600',
    failed: 'bg-red-50 text-red-600',
    abandoned: 'bg-slate-100 text-slate-500',
  }
  return map[t] ?? 'bg-slate-100 text-slate-600'
}
function formatTime(t: string) {
  return new Date(t).toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}
function formatDate(d: string) {
  if (!d) return '-'
  return new Date(d).toLocaleDateString('zh-CN')
}

function toggleStatusFilter(s: string) {
  filters.status = filters.status === s ? '' : s
  page.value = 1
  fetchList()
}
function toggleTagFilter(t: string) {
  filters.tag = filters.tag === t ? '' : t
  page.value = 1
  fetchList()
}
function resetFilters() {
  filters.keyword = ''
  filters.status = ''
  filters.tag = ''
  page.value = 1
  fetchList()
}

async function fetchStats() {
  try {
    const res: any = await request.get('/applications/stats')
    const d = res?.data ?? res
    stats.value = { total: d.total ?? 0, byStatus: d.byStatus ?? [], byTag: d.byTag ?? [] }
    statsByStatus.value = (d.byStatus ?? []).map((x: any) => ({ status: x.status, count: +x.count }))
    statsByTag.value = (d.byTag ?? []).map((x: any) => ({ tag: x.tag, count: +x.count }))
  } catch {}
}

async function fetchList() {
  loading.value = true
  try {
    const res: any = await request.get('/applications', {
      params: {
        page: page.value,
        pageSize: pageSize.value,
        keyword: filters.keyword.trim() || undefined,
        status: filters.status || undefined,
        tag: filters.tag || undefined,
      },
    })
    const d = res?.data ?? res
    applications.value = d.list ?? []
    total.value = d.total ?? 0
    page.value = d.page ?? page.value
    pageSize.value = d.pageSize ?? pageSize.value
  } catch {
  } finally {
    loading.value = false
  }
}

function toggleExpand(id: number) {
  if (expandedId.value === id) {
    expandedId.value = null
    return
  }
  expandedId.value = id
  fetchLogs(id)
  fetchNotes(id)
}

async function fetchLogs(id: number) {
  loadingLogs.value[id] = true
  try {
    const res: any = await request.get(`/applications/${id}/logs`)
    const list = res?.data ?? res ?? []
    logsMap.value = { ...logsMap.value, [id]: Array.isArray(list) ? list : [] }
  } catch {
    logsMap.value = { ...logsMap.value, [id]: [] }
  } finally {
    loadingLogs.value[id] = false
  }
}

async function fetchNotes(id: number) {
  loadingNotes.value[id] = true
  try {
    const res: any = await request.get(`/applications/${id}/notes`)
    const list = res?.data ?? res ?? []
    notesMap.value = { ...notesMap.value, [id]: Array.isArray(list) ? list : [] }
  } catch {
    notesMap.value = { ...notesMap.value, [id]: [] }
  } finally {
    loadingNotes.value[id] = false
  }
}

async function changeStatus(app: Application, newStatus: string) {
  const oldStatus = app.status
  if (oldStatus === newStatus) return
  try {
    await request.put(`/applications/${app.id}/status`, { status: newStatus })
    app.status = newStatus
    toast('状态已更新', 'success')
    fetchStats()
    if (expandedId.value === app.id) fetchLogs(app.id)
  } catch {
    app.status = oldStatus
  }
}

async function addNote(app: Application) {
  const content = (newNoteContent.value[app.id] ?? '').trim()
  if (!content) return
  try {
    await request.post(`/applications/${app.id}/notes`, { content })
    newNoteContent.value = { ...newNoteContent.value, [app.id]: '' }
    toast('备注已添加', 'success')
    fetchNotes(app.id)
  } catch {}
}

async function deleteNote(app: Application, noteId: number) {
  try {
    await request.delete(`/applications/notes/${noteId}`)
    toast('备注已删除', 'success')
    fetchNotes(app.id)
  } catch {}
}

function openCreateModal() {
  form.company = ''
  form.position = ''
  form.channel = ''
  form.salaryRange = ''
  form.location = ''
  form.jobDescription = ''
  showCreate.value = true
}

async function handleCreate() {
  if (!form.company.trim() || !form.position.trim()) return
  submitting.value = true
  try {
    await request.post('/applications', {
      company: form.company.trim(),
      position: form.position.trim(),
      channel: form.channel.trim() || undefined,
      salaryRange: form.salaryRange.trim() || undefined,
      location: form.location.trim() || undefined,
      jobDescription: form.jobDescription.trim() || undefined,
    })
    toast('投递记录创建成功', 'success')
    showCreate.value = false
    fetchList()
    fetchStats()
  } catch {
  } finally {
    submitting.value = false
  }
}

function openEditModal(app: Application) {
  editId.value = app.id
  editForm.company = app.company
  editForm.position = app.position
  editForm.channel = app.channel ?? ''
  editForm.salaryRange = app.salaryRange ?? ''
  editForm.location = app.location ?? ''
  editForm.nextDate = app.nextDate ? app.nextDate.split('T')[0] : ''
  editForm.remark = app.remark ?? ''
  showEdit.value = true
}

async function handleEdit() {
  if (!editId.value || !editForm.company.trim() || !editForm.position.trim()) return
  submitting.value = true
  try {
    await request.put(`/applications/${editId.value}`, {
      company: editForm.company.trim(),
      position: editForm.position.trim(),
      channel: editForm.channel.trim() || undefined,
      salaryRange: editForm.salaryRange.trim() || undefined,
      location: editForm.location.trim() || undefined,
      nextDate: editForm.nextDate || undefined,
      remark: editForm.remark.trim() || undefined,
    })
    toast('投递记录已更新', 'success')
    showEdit.value = false
    const idx = applications.value.findIndex((a) => a.id === editId.value)
    if (idx >= 0) {
      applications.value[idx] = { ...applications.value[idx], ...editForm }
    }
    fetchList()
  } catch {
  } finally {
    submitting.value = false
  }
}

function confirmDelete(app: Application) {
  deleteTarget.value = app
}

async function handleDelete() {
  if (!deleteTarget.value) return
  const id = deleteTarget.value.id
  try {
    await request.delete(`/applications/${id}`)
    toast('投递记录已删除', 'success')
    deleteTarget.value = null
    if (expandedId.value === id) expandedId.value = null
    fetchList()
    fetchStats()
  } catch {
  } finally {
    deleteTarget.value = null
  }
}

watch([() => filters.status, () => filters.tag, () => filters.keyword], () => {
  page.value = 1
})

onMounted(() => {
  if (isLoggedIn.value) {
    fetchStats()
    fetchList()
  }
})
</script>
