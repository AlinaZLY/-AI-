<template>
  <div class="page-shell max-w-5xl mx-auto space-y-6 pb-12">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-bold text-gray-900">{{ $t('面试题库') }}</h1>
        <p class="text-sm text-gray-400 mt-0.5">{{ $t('浏览、搜索、投稿面试真题') }}</p>
      </div>
      <router-link to="/interview"
        class="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        {{ $t('开始模拟面试') }}
      </router-link>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div class="rounded-xl bg-white border border-gray-100 p-4 text-center">
        <p class="text-[11px] text-gray-400 font-medium">{{ $t('题目总数') }}</p>
        <p class="text-2xl font-bold text-gray-900 mt-1">{{ questionTotal }}</p>
      </div>
      <div class="rounded-xl bg-white border border-gray-100 p-4 text-center">
        <p class="text-[11px] text-blue-500 font-medium">{{ $t('分类数') }}</p>
        <p class="text-2xl font-bold text-blue-600 mt-1">{{ totalCategoryCount }}</p>
      </div>
      <div class="rounded-xl bg-white border border-gray-100 p-4 text-center">
        <p class="text-[11px] text-emerald-500 font-medium">{{ $t('已练习') }}</p>
        <p class="text-2xl font-bold text-emerald-600 mt-1">{{ practiceStats.totalPracticed }}</p>
      </div>
      <div class="rounded-xl bg-white border border-gray-100 p-4 text-center">
        <p class="text-[11px] text-amber-500 font-medium">{{ $t('平均分') }}</p>
        <p class="text-2xl font-bold text-amber-600 mt-1">{{ practiceStats.avgScore || '--' }}</p>
      </div>
    </div>

    <!-- Question bank -->
    <section class="rounded-2xl bg-white border border-gray-100 p-5">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <h2 class="text-sm font-semibold text-gray-900">{{ $t('题库浏览') }}</h2>
        <div class="flex gap-2">
          <input v-model="questionKeyword" type="text" :placeholder="$t('搜索题目或公司')"
            class="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 sm:w-52"
            @keyup.enter="handleQuestionSearch" />
          <button type="button" class="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-50" @click="resetQuestionFilters">{{ $t('重置') }}</button>
          <button type="button" class="rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700" @click="handleQuestionSearch">{{ $t('搜索') }}</button>
        </div>
      </div>

      <div v-if="categoryTree.length" class="flex flex-wrap gap-1.5 mb-4">
        <button type="button" @click="selectQuestionCategory(null)"
          :class="['rounded-full border px-2.5 py-1 text-xs transition-colors', questionCategoryId == null ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-500 hover:border-gray-300']">{{ $t('全部题目') }}</button>
        <button v-for="cat in categoryTree" :key="`q-root-${cat.id}`" type="button" @click="selectQuestionRootCategory(cat)"
          :class="['inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-colors',
            questionCategoryId === cat.id || isQuestionDescendantSelected(cat) ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-500 hover:border-gray-300']">
          <span class="h-4 w-4 rounded bg-gradient-to-br flex items-center justify-center shrink-0" :class="categoryColor(categoryTree.indexOf(cat))">
            <svg class="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" :d="categoryIcon(categoryTree.indexOf(cat))" /></svg>
          </span>
          {{ $t(cat.name) }}
        </button>
      </div>
      <div v-if="questionChildCategories.length" class="flex flex-wrap gap-1.5 mb-4">
        <button v-for="cat in questionChildCategories" :key="`q-child-${cat.id}`" type="button" @click="selectQuestionCategory(cat.id)"
          :class="['rounded-full border px-2.5 py-1 text-[11px] transition-colors', questionCategoryId === cat.id ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-200 text-gray-500 hover:bg-gray-50']">{{ $t(cat.name) }}</button>
      </div>

      <div v-if="questionLoading" class="flex justify-center py-10"><div class="h-7 w-7 animate-spin rounded-full border-3 border-blue-500 border-t-transparent"></div></div>
      <div v-else-if="questionBank.length" class="space-y-3">
        <article v-for="question in questionBank" :key="question.id"
          class="rounded-xl border border-gray-100 bg-gray-50/40 overflow-hidden transition-all"
          :class="expandedId === question.id ? 'ring-1 ring-blue-200 border-blue-200' : ''">
          <div class="p-4 cursor-pointer" @click="toggleExpand(question.id)">
            <div class="flex items-start justify-between gap-3">
              <div class="flex-1 min-w-0">
                <div class="mb-2 flex flex-wrap items-center gap-1.5">
                  <span :class="questionTypeClass(question.questionType)" class="rounded-full px-2 py-0.5 text-[10px] font-medium">{{ questionTypeLabel(question.questionType) }}</span>
                  <span :class="questionDifficultyClass(question.difficulty)" class="rounded-full px-2 py-0.5 text-[10px] font-medium">{{ questionDifficultyLabel(question.difficulty) }}</span>
                  <span v-if="question.company" class="rounded-full bg-purple-50 px-2 py-0.5 text-[10px] font-medium text-purple-600">{{ question.company }}</span>
                </div>
                <h3 class="text-sm leading-relaxed text-gray-900">{{ question.question }}</h3>
                <div v-if="question.tags?.length" class="mt-2 flex flex-wrap gap-1.5">
                  <span v-for="tag in question.tags.slice(0, 4)" :key="`${question.id}-${tag}`" class="rounded-full bg-white px-2 py-0.5 text-[10px] text-gray-400 ring-1 ring-gray-200">{{ tag }}</span>
                </div>
              </div>
              <div class="shrink-0 flex items-center gap-2">
                <span v-if="practiceResults[question.id]" class="text-xs font-bold px-2 py-0.5 rounded-full"
                  :class="practiceResults[question.id].score >= 80 ? 'bg-emerald-50 text-emerald-600' : practiceResults[question.id].score >= 60 ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'">
                  {{ practiceResults[question.id].score }}{{ $t('分') }}
                </span>
                <svg class="w-4 h-4 text-gray-400 transition-transform" :class="expandedId === question.id ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>

          <!-- Expanded: answer area -->
          <div v-if="expandedId === question.id" class="border-t border-gray-100 bg-white p-4 space-y-4">
            <!-- Previous result -->
            <div v-if="practiceResults[question.id]" class="rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
              <div class="flex items-center justify-between mb-3">
                <h4 class="text-sm font-semibold text-gray-900">{{ $t('上次答题结果') }}</h4>
                <div class="text-2xl font-bold" :class="practiceResults[question.id].score >= 80 ? 'text-emerald-600' : practiceResults[question.id].score >= 60 ? 'text-amber-600' : 'text-red-500'">
                  {{ practiceResults[question.id].score }}<span class="text-sm font-normal text-gray-400">/100</span>
                </div>
              </div>
              <!-- Dimension scores -->
              <div v-if="practiceResults[question.id].dimensionScores" class="grid grid-cols-5 gap-2 mb-3">
                <div v-for="(val, key) in practiceResults[question.id].dimensionScores" :key="key" class="text-center">
                  <div class="text-lg font-bold" :class="val >= 80 ? 'text-emerald-600' : val >= 60 ? 'text-amber-600' : 'text-red-500'">{{ val }}</div>
                  <div class="text-[10px] text-gray-400 truncate">{{ key }}</div>
                </div>
              </div>
              <p class="text-xs text-gray-600 whitespace-pre-line leading-relaxed">{{ practiceResults[question.id].feedback }}</p>
            </div>

            <!-- Answer input: varies by question type -->
            <div>
              <!-- Choice question -->
              <template v-if="question.questionType === 'choice'">
                <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('请选择答案') }}</label>
                <div class="space-y-2">
                  <label v-for="opt in (question.options || [])" :key="opt.value"
                    :class="['flex items-center gap-3 rounded-xl border-2 px-4 py-3 cursor-pointer transition-all',
                      selectedOptions[question.id] === opt.value
                        ? 'border-blue-500 bg-blue-50'
                        : practiceResults[question.id] && opt.isCorrect ? 'border-emerald-400 bg-emerald-50'
                        : practiceResults[question.id] && selectedOptions[question.id] === opt.value && !opt.isCorrect ? 'border-red-400 bg-red-50'
                        : 'border-gray-100 hover:border-gray-300']"
                    @click="!practiceResults[question.id] && (selectedOptions[question.id] = opt.value)">
                    <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0"
                      :class="selectedOptions[question.id] === opt.value ? 'border-blue-500 bg-blue-500' : 'border-gray-300'">
                      <div v-if="selectedOptions[question.id] === opt.value" class="w-2 h-2 rounded-full bg-white"></div>
                    </div>
                    <span class="text-sm font-medium text-gray-400 mr-1">{{ opt.value }}.</span>
                    <span class="text-sm text-gray-800">{{ opt.label }}</span>
                    <svg v-if="practiceResults[question.id] && opt.isCorrect" class="w-4 h-4 ml-auto text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
                    <svg v-if="practiceResults[question.id] && selectedOptions[question.id] === opt.value && !opt.isCorrect" class="w-4 h-4 ml-auto text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12" /></svg>
                  </label>
                </div>
              </template>

              <!-- Judgment question -->
              <template v-else-if="question.questionType === 'judgment'">
                <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('请判断') }}</label>
                <div class="grid grid-cols-2 gap-3">
                  <button v-for="opt in (question.options || [])" :key="opt.value" type="button"
                    @click="!practiceResults[question.id] && (selectedOptions[question.id] = opt.value)"
                    :class="['rounded-xl border-2 py-4 text-center font-medium transition-all',
                      selectedOptions[question.id] === opt.value
                        ? (practiceResults[question.id]
                          ? (opt.isCorrect ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-red-500 bg-red-50 text-red-700')
                          : 'border-blue-500 bg-blue-50 text-blue-700')
                        : practiceResults[question.id] && opt.isCorrect ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                        : 'border-gray-100 text-gray-600 hover:border-gray-300']">
                    <svg v-if="opt.value === 'true'" class="w-6 h-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>
                    <svg v-else class="w-6 h-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                    <div class="text-sm mt-1">{{ opt.label }}</div>
                  </button>
                </div>
              </template>

              <!-- Open / Short answer question -->
              <template v-else>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">{{ $t('你的回答') }}</label>
                <textarea v-model="answerTexts[question.id]" rows="4" :placeholder="$t('请输入你的回答...')"
                  class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none transition"></textarea>
                <div class="text-right mt-1">
                  <span class="text-[11px] text-gray-400">{{ (answerTexts[question.id] || '').length }} {{ $t('字') }}</span>
                </div>
              </template>

              <div class="mt-3 flex justify-end" v-if="!practiceResults[question.id]">
                <button @click="submitPractice(question.id, question.questionType)" :disabled="submitting[question.id] || !hasAnswer(question)"
                  class="inline-flex items-center gap-1.5 px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-50 shadow-sm transition">
                  <svg v-if="submitting[question.id]" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25" /><path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" class="opacity-75" /></svg>
                  {{ submitting[question.id] ? $t('评分中...') : $t('提交答案') }}
                </button>
              </div>
              <div v-if="practiceResults[question.id] && !practiceResults[question.id].dimensionScores?.accuracy" class="mt-3 flex justify-end">
                <button @click="retryQuestion(question.id)" class="px-4 py-1.5 text-sm text-blue-600 border border-blue-200 rounded-xl hover:bg-blue-50 transition">{{ $t('重新答题') }}</button>
              </div>
            </div>
          </div>
        </article>
      </div>
      <div v-else class="py-10 text-center text-sm text-gray-400">{{ $t('当前条件下暂无题目') }}</div>

      <div v-if="questionTotal > questionPageSize" class="mt-4 flex items-center justify-center gap-3">
        <button type="button" class="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-50 disabled:opacity-40" :disabled="questionPage <= 1" @click="changeQuestionPage(questionPage - 1)">{{ $t('上一页') }}</button>
        <span class="text-xs text-gray-400">{{ questionPage }} / {{ questionTotalPages }}</span>
        <button type="button" class="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-50 disabled:opacity-40" :disabled="questionPage >= questionTotalPages" @click="changeQuestionPage(questionPage + 1)">{{ $t('下一页') }}</button>
      </div>
    </section>

    <!-- Practice history -->
    <section v-if="isLoggedIn" class="rounded-2xl bg-white border border-gray-100 p-5">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-sm font-semibold text-gray-900">{{ $t('练习记录') }}</h2>
        <div class="flex items-center gap-2">
          <span class="text-xs text-gray-400">{{ $t('共 {n} 条', { n: practiceHistoryTotal }) }}</span>
          <button @click="loadPracticeHistory" class="text-[11px] text-blue-600 hover:underline">{{ $t('刷新') }}</button>
        </div>
      </div>
      <div v-if="practiceHistoryLoading" class="text-sm text-gray-400 text-center py-6">{{ $t('加载中...') }}</div>
      <div v-else-if="!practiceHistory.length" class="text-xs text-gray-400 text-center py-6">{{ $t('暂无练习记录，开始答题吧') }}</div>
      <div v-else class="space-y-2">
        <div v-for="record in practiceHistory" :key="record.id"
          class="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/40 px-4 py-3">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
            :class="record.score >= 80 ? 'bg-emerald-50 text-emerald-600' : record.score >= 60 ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-500'">
            {{ record.score }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm text-gray-800 line-clamp-1">{{ record.question?.question || $t('题目已删除') }}</p>
            <div class="flex items-center gap-2 mt-0.5">
              <span v-if="record.question?.questionType" :class="questionTypeClass(record.question.questionType)" class="rounded-full px-2 py-0.5 text-[10px] font-medium">{{ questionTypeLabel(record.question.questionType) }}</span>
              <span class="text-[10px] text-gray-400">{{ formatSubmissionDate(record.createdAt) }}</span>
            </div>
          </div>
          <div v-if="record.feedback" class="shrink-0">
            <button @click="expandedHistoryId = expandedHistoryId === record.id ? null : record.id"
              class="text-[11px] text-blue-500 hover:text-blue-700">{{ expandedHistoryId === record.id ? $t('收起') : $t('查看反馈') }}</button>
          </div>
        </div>
        <div v-for="record in practiceHistory" :key="'fb-' + record.id" v-show="expandedHistoryId === record.id && record.feedback"
          class="rounded-xl bg-blue-50/60 border border-blue-100 p-3 -mt-1 ml-13">
          <p class="text-xs text-gray-600 whitespace-pre-line leading-relaxed">{{ record.feedback }}</p>
        </div>
      </div>
      <div v-if="practiceHistoryTotal > practiceHistoryPageSize" class="mt-3 flex items-center justify-center gap-3">
        <button class="rounded-lg border border-gray-200 px-3 py-1 text-xs text-gray-500 hover:bg-gray-50 disabled:opacity-40"
          :disabled="practiceHistoryPage <= 1" @click="practiceHistoryPage--; loadPracticeHistory()">{{ $t('上一页') }}</button>
        <span class="text-[11px] text-gray-400">{{ practiceHistoryPage }} / {{ Math.ceil(practiceHistoryTotal / practiceHistoryPageSize) }}</span>
        <button class="rounded-lg border border-gray-200 px-3 py-1 text-xs text-gray-500 hover:bg-gray-50 disabled:opacity-40"
          :disabled="practiceHistoryPage >= Math.ceil(practiceHistoryTotal / practiceHistoryPageSize)" @click="practiceHistoryPage++; loadPracticeHistory()">{{ $t('下一页') }}</button>
      </div>
    </section>

    <!-- Submit questions -->
    <section v-if="isLoggedIn" class="rounded-2xl bg-white border border-gray-100 p-5">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-sm font-semibold text-gray-900">{{ $t('投稿面试题') }}</h2>
        <button @click="showSubmitForm = !showSubmitForm" class="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
          {{ showSubmitForm ? $t('收起') : $t('提交题目') }}
        </button>
      </div>
      <div v-if="showSubmitForm" class="mb-5 rounded-xl border border-blue-100 bg-blue-50/30 p-4">
        <div class="grid gap-3 md:grid-cols-2">
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">{{ $t('题目内容') }} *</label>
            <textarea v-model="submitForm.question" rows="2" :placeholder="$t('请输入面试题目')" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none resize-none"></textarea>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">{{ $t('参考答案') }}</label>
            <textarea v-model="submitForm.answer" rows="2" :placeholder="$t('可选，提供参考答案')" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none resize-none"></textarea>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">{{ $t('难度') }}</label>
            <select v-model="submitForm.difficulty" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
              <option value="easy">{{ $t('简单') }}</option><option value="medium">{{ $t('中等') }}</option><option value="hard">{{ $t('困难') }}</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">{{ $t('分类') }}</label>
            <select v-model="submitForm.categoryId" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
              <option :value="null">{{ $t('不指定') }}</option>
              <template v-for="cat in categoryTree" :key="cat.id">
                <option :value="cat.id">{{ $t(cat.name) }}</option>
                <option v-for="sub in cat.children" :key="sub.id" :value="sub.id">&nbsp;&nbsp;└ {{ $t(sub.name) }}</option>
              </template>
            </select>
          </div>
        </div>
        <div class="mt-3 flex justify-end">
          <button @click="handleSubmitQuestion" :disabled="submittingQuestion || !submitForm.question.trim()" class="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50">{{ submittingQuestion ? $t('提交中...') : $t('提交投稿') }}</button>
        </div>
      </div>
      <div>
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-xs font-medium text-gray-500">{{ $t('我的投稿') }}</h3>
          <button @click="fetchMySubmissions" class="text-[11px] text-blue-600 hover:underline">{{ $t('刷新') }}</button>
        </div>
        <div v-if="mySubmissionsLoading" class="text-sm text-gray-400 text-center py-4">{{ $t('加载中...') }}</div>
        <div v-else-if="mySubmissions.length === 0" class="text-xs text-gray-400 text-center py-4">{{ $t('暂无投稿记录') }}</div>
        <div v-else class="space-y-1.5">
          <div v-for="s in mySubmissions" :key="s.id" class="flex items-start justify-between gap-3 rounded-lg border border-gray-50 bg-gray-50/40 p-2.5">
            <div class="flex-1 min-w-0">
              <p class="text-sm text-gray-800 line-clamp-1">{{ s.question }}</p>
              <div class="flex items-center gap-2 text-[10px] text-gray-400 mt-0.5"><span>{{ s.difficulty }}</span><span>·</span><span>{{ formatSubmissionDate(s.createdAt) }}</span></div>
            </div>
            <span class="shrink-0 text-[10px] px-1.5 py-0.5 rounded-full" :class="reviewStatusClass(s.reviewStatus)">{{ reviewStatusLabel(s.reviewStatus) }}</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import request from '@/utils/request'
import { toast } from '@/utils/toast'
import { getCategoriesApi, getQuestionsApi, submitPracticeApi, getPracticeHistoryApi, getPracticeStatsApi, submitQuestionApi, getMySubmissionsApi } from '@/api/interview'
import { useI18n } from '@/i18n'

type CategoryNode = { id: number; name: string; children?: CategoryNode[] }

const isLoggedIn = computed(() => !!localStorage.getItem('token'))
const { t, formatDateTime } = useI18n()

const categoryTree = ref<CategoryNode[]>([])
const categoriesLoading = ref(false)
const questionBank = ref<any[]>([])
const questionLoading = ref(false)
const questionKeyword = ref('')
const questionPage = ref(1)
const questionPageSize = 8
const questionTotal = ref(0)
const questionCategoryId = ref<number | null>(null)
const questionExpandedRootId = ref<number | null>(null)

const expandedId = ref<number | null>(null)
const answerTexts = reactive<Record<number, string>>({})
const selectedOptions = reactive<Record<number, string>>({})
const submitting = reactive<Record<number, boolean>>({})
const practiceResults = reactive<Record<number, { score: number; dimensionScores: Record<string, number>; feedback: string }>>({})
const practiceStats = ref({ totalPracticed: 0, uniqueQuestions: 0, avgScore: 0, bestScore: 0 })

const practiceHistory = ref<any[]>([])
const practiceHistoryLoading = ref(false)
const practiceHistoryPage = ref(1)
const practiceHistoryPageSize = 10
const practiceHistoryTotal = ref(0)
const expandedHistoryId = ref<number | null>(null)

const totalCategoryCount = computed(() => {
  let count = 0
  for (const cat of categoryTree.value) {
    count++
    if (cat.children) count += cat.children.length
  }
  return count
})

const questionChildCategories = computed(() => {
  const rootId = questionExpandedRootId.value
  if (rootId == null) return []
  return categoryTree.value.find((c) => c.id === rootId)?.children ?? []
})

const questionTotalPages = computed(() => Math.max(1, Math.ceil(questionTotal.value / questionPageSize)))

const CATEGORY_ICONS = [
  'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
  'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
  'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
  'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4',
  'M13 10V3L4 14h7v7l9-11h-7z',
  'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
]
const CATEGORY_COLORS = [
  'from-blue-500 to-indigo-600', 'from-emerald-500 to-teal-600',
  'from-amber-400 to-orange-500', 'from-purple-500 to-violet-600',
  'from-cyan-500 to-blue-600', 'from-rose-500 to-pink-600',
  'from-yellow-400 to-amber-500', 'from-sky-400 to-cyan-600',
]

function categoryIcon(index: number) { return CATEGORY_ICONS[index % CATEGORY_ICONS.length] }
function categoryColor(index: number) { return CATEGORY_COLORS[index % CATEGORY_COLORS.length] }

function containsId(nodes: CategoryNode[], id: number): boolean {
  for (const n of nodes) {
    if (n.id === id) return true
    if (n.children?.length && containsId(n.children, id)) return true
  }
  return false
}
function findRootContainingId(tree: CategoryNode[], id: number | null): CategoryNode | null {
  if (id == null) return tree[0] ?? null
  for (const node of tree) {
    if (node.id === id) return node
    if (node.children?.length && containsId(node.children, id)) return node
  }
  return null
}

function toggleExpand(id: number) {
  expandedId.value = expandedId.value === id ? null : id
}

function selectQuestionRootCategory(cat: CategoryNode) {
  questionExpandedRootId.value = cat.id
  questionCategoryId.value = cat.id
  questionPage.value = 1
  loadQuestionBank()
}
function selectQuestionCategory(categoryId: number | null) {
  questionCategoryId.value = categoryId
  if (categoryId == null) questionExpandedRootId.value = categoryTree.value[0]?.id ?? null
  else {
    const root = findRootContainingId(categoryTree.value, categoryId)
    if (root) questionExpandedRootId.value = root.id
  }
  questionPage.value = 1
  loadQuestionBank()
}
function isQuestionDescendantSelected(root: CategoryNode) {
  if (questionCategoryId.value == null) return false
  if (root.id === questionCategoryId.value) return false
  return !!root.children?.length && containsId(root.children, questionCategoryId.value)
}
function handleQuestionSearch() { questionPage.value = 1; loadQuestionBank() }
function resetQuestionFilters() {
  questionKeyword.value = ''
  questionCategoryId.value = null
  questionExpandedRootId.value = categoryTree.value[0]?.id ?? null
  questionPage.value = 1
  loadQuestionBank()
}
function changeQuestionPage(page: number) { questionPage.value = page; loadQuestionBank() }

function questionTypeLabel(type: string) {
  return { open: t('开放题'), choice: t('选择题'), judgment: t('判断题'), short_answer: t('简答题') }[type] || t('题目')
}
function questionTypeClass(type: string) {
  return { open: 'bg-gray-100 text-gray-600', choice: 'bg-blue-50 text-blue-600', judgment: 'bg-amber-50 text-amber-600', short_answer: 'bg-emerald-50 text-emerald-600' }[type] || 'bg-gray-100 text-gray-600'
}
function questionDifficultyLabel(difficulty: string) {
  return { easy: t('简单'), medium: t('中等'), hard: t('困难') }[difficulty] || difficulty || t('未知')
}
function questionDifficultyClass(difficulty: string) {
  return { easy: 'bg-green-50 text-green-600', medium: 'bg-orange-50 text-orange-600', hard: 'bg-red-50 text-red-600' }[difficulty] || 'bg-gray-100 text-gray-600'
}

async function loadCategories() {
  categoriesLoading.value = true
  try {
    const res: any = await getCategoriesApi()
    categoryTree.value = res.data || []
    if (categoryTree.value.length && questionExpandedRootId.value == null)
      questionExpandedRootId.value = categoryTree.value[0].id
  } catch { categoryTree.value = [] }
  finally { categoriesLoading.value = false }
}

async function loadQuestionBank() {
  questionLoading.value = true
  try {
    const res: any = await getQuestionsApi({
      page: questionPage.value, pageSize: questionPageSize,
      categoryId: questionCategoryId.value ?? undefined,
      keyword: questionKeyword.value.trim() || undefined,
    })
    questionBank.value = res.data?.list || []
    questionTotal.value = res.data?.total || 0
  } catch { questionBank.value = []; questionTotal.value = 0 }
  finally { questionLoading.value = false }
}

function hasAnswer(question: any): boolean {
  if (question.questionType === 'choice' || question.questionType === 'judgment')
    return !!selectedOptions[question.id]
  return !!(answerTexts[question.id] || '').trim()
}

function retryQuestion(questionId: number) {
  delete practiceResults[questionId]
  delete selectedOptions[questionId]
  answerTexts[questionId] = ''
}

async function submitPractice(questionId: number, questionType?: string) {
  const answer = (questionType === 'choice' || questionType === 'judgment')
    ? selectedOptions[questionId]
    : (answerTexts[questionId] || '').trim()
  if (!answer) return
  if (!isLoggedIn.value) {
    toast(t('请先登录后答题'), 'warning')
    return
  }
  submitting[questionId] = true
  try {
    const res: any = await submitPracticeApi(questionId, { answer })
    const data = res.data ?? res
    practiceResults[questionId] = {
      score: data.score,
      dimensionScores: data.dimensionScores,
      feedback: data.feedback,
    }
    if (data.isCorrect === true) toast(t('回答正确！'), 'success')
    else if (data.isCorrect === false) toast(t('回答错误'), 'error')
    else toast(t('评分完成：{score} 分', { score: data.score }), 'success')
    loadPracticeStats()
    loadPracticeHistory()
  } catch {
    toast(t('评分失败，请重试'), 'error')
  } finally {
    submitting[questionId] = false
  }
}

async function loadPracticeStats() {
  if (!isLoggedIn.value) return
  try {
    const res: any = await getPracticeStatsApi()
    practiceStats.value = res.data ?? res
  } catch { /* keep defaults */ }
}

async function loadPracticeHistory() {
  if (!isLoggedIn.value) return
  practiceHistoryLoading.value = true
  try {
    const res: any = await getPracticeHistoryApi({ page: practiceHistoryPage.value, pageSize: practiceHistoryPageSize })
    const data = res.data ?? res
    practiceHistory.value = data.list || []
    practiceHistoryTotal.value = data.total || 0
  } catch {
    practiceHistory.value = []
    practiceHistoryTotal.value = 0
  } finally {
    practiceHistoryLoading.value = false
  }
}

// Submit
const showSubmitForm = ref(false)
const submittingQuestion = ref(false)
const submitForm = reactive({ question: '', answer: '', difficulty: 'medium', categoryId: null as number | null })
const mySubmissions = ref<any[]>([])
const mySubmissionsLoading = ref(false)

async function handleSubmitQuestion() {
  if (!submitForm.question.trim()) return
  submittingQuestion.value = true
  try {
    await submitQuestionApi({
      question: submitForm.question.trim(),
      referenceAnswer: submitForm.answer.trim() || undefined,
      difficulty: submitForm.difficulty,
      categoryId: submitForm.categoryId || undefined,
      questionType: 'open',
    })
    toast(t('投稿成功，等待管理员审核'), 'success')
    submitForm.question = ''
    submitForm.answer = ''
    submitForm.difficulty = 'medium'
    submitForm.categoryId = null
    showSubmitForm.value = false
    fetchMySubmissions()
  } catch {}
  finally { submittingQuestion.value = false }
}

async function fetchMySubmissions() {
  mySubmissionsLoading.value = true
  try {
    const res: any = await getMySubmissionsApi()
    const d = res.data ?? res
    mySubmissions.value = Array.isArray(d) ? d : (d.list || [])
  } catch { mySubmissions.value = [] }
  finally { mySubmissionsLoading.value = false }
}

function formatSubmissionDate(d: string) {
  if (!d) return ''
  return formatDateTime(d, { year: 'numeric', month: '2-digit', day: '2-digit' })
}
function reviewStatusLabel(status: string) {
  return ({ draft: t('草稿'), pending: t('待审核'), approved: t('已采纳'), rejected: t('已驳回') } as Record<string, string>)[status] || status
}
function reviewStatusClass(status: string) {
  return ({ draft: 'bg-gray-100 text-gray-600', pending: 'bg-amber-50 text-amber-600', approved: 'bg-emerald-50 text-emerald-600', rejected: 'bg-red-50 text-red-600' } as Record<string, string>)[status] || 'bg-gray-100 text-gray-600'
}

onMounted(() => {
  loadCategories()
  loadQuestionBank()
  if (isLoggedIn.value) {
    fetchMySubmissions()
    loadPracticeStats()
    loadPracticeHistory()
  }
})
</script>
