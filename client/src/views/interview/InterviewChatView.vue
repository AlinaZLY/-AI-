<template>
  <div class="fixed inset-0 flex flex-col overflow-hidden bg-[#f8f9fb]">
    <!-- Top bar -->
    <header class="flex items-center justify-between px-5 h-14 bg-white border-b border-gray-100 shrink-0 z-10 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div class="flex items-center gap-3">
        <button @click="goBack" class="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div class="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">AI</div>
        <div>
          <h1 class="text-sm font-semibold text-gray-900 leading-tight">{{ interview?.jobTitle || $t('AI 模拟面试') }}</h1>
          <p v-if="interview" class="text-[11px] text-gray-400 leading-tight mt-0.5">
            {{ answeredCount }}/{{ totalCount }} {{ $t('题') }}
            <span v-if="interview.status === 'completed'" class="ml-1 text-emerald-500 font-medium">· {{ $t('已完成') }}</span>
          </p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <div v-if="interview?.totalScore" class="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200">
          <svg class="w-3.5 h-3.5 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
          <span class="text-sm font-bold text-amber-700">{{ interview.totalScore }}</span>
        </div>
      </div>
    </header>

    <!-- Loading -->
    <div v-if="pageLoading" class="flex-1 flex items-center justify-center overflow-hidden">
      <div class="flex flex-col items-center gap-3">
        <div class="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p class="text-sm text-gray-400">{{ $t('正在准备面试...') }}</p>
      </div>
    </div>

    <!-- Main -->
    <div v-else class="flex-1 flex overflow-hidden">
      <!-- Left panel -->
      <aside class="w-[280px] shrink-0 flex flex-col overflow-hidden max-lg:hidden bg-gradient-to-b from-slate-50 to-white border-r border-gray-100/80">
        <!-- Progress header -->
        <div class="p-5 pb-4">
          <div class="flex items-center gap-4 mb-5">
            <div class="relative">
              <svg class="w-16 h-16 -rotate-90 drop-shadow-sm" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="27" fill="none" stroke="#f1f5f9" stroke-width="4" />
                <circle cx="32" cy="32" r="27" fill="none" stroke="url(#panelGrad)" stroke-width="4" stroke-linecap="round"
                  :stroke-dasharray="`${progress * 169.6} 169.6`" class="transition-all duration-700" />
                <defs>
                  <linearGradient id="panelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#6366f1" />
                    <stop offset="50%" stop-color="#3b82f6" />
                    <stop offset="100%" stop-color="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
              <span class="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-700">{{ Math.round(progress * 100) }}%</span>
            </div>
            <div>
              <p class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{{ answeredCount }}<span class="text-base font-medium text-gray-400"> / {{ totalCount }}</span></p>
              <p class="text-[11px] text-gray-400 mt-0.5">{{ $t('已回答') }}</p>
            </div>
          </div>

          <!-- Question grid -->
          <div class="bg-white rounded-xl p-3 shadow-sm border border-gray-100/80">
            <div class="flex items-center gap-2 mb-2.5">
              <svg class="w-3.5 h-3.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
              <p class="text-[11px] font-semibold text-gray-500">{{ $t('题目列表') }}</p>
            </div>
            <div class="flex flex-wrap gap-1.5">
              <div
                v-for="q in (interview?.questions || [])"
                :key="q.id"
                class="w-7 h-7 rounded-lg text-[10px] font-bold flex items-center justify-center transition-all duration-300 cursor-default"
                :class="q.isAnswered
                  ? 'bg-gradient-to-br from-emerald-400 to-emerald-500 text-white shadow-sm shadow-emerald-200/50'
                  : currentQuestion?.id === q.id
                    ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-200/50 scale-110 ring-2 ring-blue-200'
                    : 'bg-gray-50 text-gray-400 border border-gray-100'"
              >{{ q.orderIndex }}</div>
            </div>
            <div class="flex items-center gap-4 mt-3 pt-2.5 border-t border-gray-50">
              <div class="flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded bg-gradient-to-br from-emerald-400 to-emerald-500" />
                <span class="text-[10px] text-gray-400">{{ $t('已完成') }}</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded bg-gradient-to-br from-blue-500 to-indigo-600" />
                <span class="text-[10px] text-gray-400">{{ $t('当前题') }}</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded bg-gray-100 border border-gray-200" />
                <span class="text-[10px] text-gray-400">{{ $t('待回答') }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Divider -->
        <div class="mx-5 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

        <!-- Resume section -->
        <div class="flex-1 overflow-y-auto p-5 pt-4 scrollbar-thin">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <svg class="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <p class="text-xs font-semibold text-gray-700">{{ $t('关联简历') }}</p>
          </div>

          <template v-if="resume">
            <div class="space-y-3.5">
              <div class="rounded-xl bg-gradient-to-br from-blue-50/80 via-indigo-50/60 to-purple-50/40 p-3.5 border border-blue-100/50">
                <p class="text-sm font-semibold text-gray-800 leading-snug">{{ resume.title }}</p>
                <p v-if="resume.targetPosition" class="text-[11px] text-blue-600/80 mt-1 flex items-center gap-1">
                  <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  {{ resume.targetPosition }}
                </p>
              </div>

              <template v-if="resume.content">
                <div v-if="resume.content.skills?.length">
                  <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">{{ $t('技能') }}</p>
                  <div class="flex flex-wrap gap-1.5">
                    <span v-for="(s, si) in resume.content.skills" :key="s"
                      class="px-2 py-0.5 rounded-full text-[10px] font-medium border"
                      :class="[
                        ['bg-blue-50 text-blue-600 border-blue-100', 'bg-emerald-50 text-emerald-600 border-emerald-100',
                         'bg-amber-50 text-amber-600 border-amber-100', 'bg-violet-50 text-violet-600 border-violet-100',
                         'bg-rose-50 text-rose-600 border-rose-100'][Number(si) % 5]
                      ]">{{ s }}</span>
                  </div>
                </div>

                <div v-if="resume.content.education?.length">
                  <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">{{ $t('教育经历') }}</p>
                  <div class="space-y-1.5">
                    <div v-for="(edu, i) in resume.content.education" :key="i" class="flex items-start gap-2 text-xs">
                      <div class="w-5 h-5 rounded-md bg-blue-50 flex items-center justify-center mt-0.5 shrink-0">
                        <svg class="w-3 h-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>
                      </div>
                      <div>
                        <span class="text-gray-700 font-medium">{{ edu.school }}</span>
                        <span v-if="edu.major" class="text-gray-400 ml-1">· {{ edu.major }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-if="resume.content.projects?.length">
                  <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">{{ $t('项目经历') }}</p>
                  <div class="space-y-2.5">
                    <div v-for="(p, i) in resume.content.projects.slice(0, 3)" :key="i" class="rounded-lg bg-gray-50/80 p-2.5 border border-gray-100/60">
                      <p class="text-xs font-medium text-gray-700">{{ p.name }}</p>
                      <p v-if="p.description" class="text-[11px] text-gray-400 line-clamp-2 mt-1 leading-relaxed">{{ p.description }}</p>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </template>
          <div v-else class="flex flex-col items-center py-10 text-gray-300">
            <div class="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-3">
              <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <p class="text-xs">{{ $t('未关联简历') }}</p>
          </div>
        </div>
      </aside>

      <!-- Chat area -->
      <main class="flex-1 flex flex-col overflow-hidden">
        <div ref="chatContainer" class="flex-1 overflow-y-auto px-6 py-6 space-y-5 scroll-smooth">
          <template v-for="(msg, idx) in chatMessages" :key="idx">
            <!-- AI -->
            <div v-if="msg.role === 'interviewer'" class="flex items-start gap-3 max-w-2xl animate-fadeIn">
              <div class="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[10px] font-bold shadow-sm mt-0.5">AI</div>
              <div class="min-w-0">
                <div class="rounded-2xl rounded-tl-md bg-white border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)] px-4 py-3">
                  <p class="text-[13px] text-gray-800 whitespace-pre-wrap leading-relaxed">{{ msg.text }}</p>
                </div>
                <span v-if="msg.questionIndex" class="text-[10px] text-gray-300 ml-3 mt-0.5 inline-block">Q{{ msg.questionIndex }}</span>
              </div>
            </div>

            <!-- User -->
            <div v-else-if="msg.role === 'user'" class="flex items-start gap-3 ml-auto max-w-2xl flex-row-reverse animate-fadeIn">
              <div class="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-[10px] font-bold shadow-sm mt-0.5">{{ userInitial }}</div>
              <div class="min-w-0">
                <!-- 语音气泡 -->
                <div v-if="msg.voiceUrl" class="rounded-2xl rounded-tr-md bg-emerald-500 text-white px-4 py-3 shadow-sm shadow-emerald-200/30 cursor-pointer select-none"
                  @click="playVoice(idx, msg.voiceUrl!)" @contextmenu="showVoiceCtxMenu($event, idx)">
                  <div class="flex items-center gap-2.5">
                    <svg v-if="playingVoiceIdx !== idx" class="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" /></svg>
                    <svg v-else class="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
                    <div class="flex items-center gap-[3px]">
                      <span v-for="n in 6" :key="n" class="w-[3px] rounded-full bg-white/70" :class="playingVoiceIdx === idx ? 'animate-voiceBar' : ''" :style="{ height: [8,14,10,16,12,8][n-1] + 'px', animationDelay: (n * 0.1) + 's' }" />
                    </div>
                    <span class="text-xs font-medium ml-1">{{ msg.voiceDuration || 0 }}"</span>
                  </div>
                  <p v-if="msg.text && msg.answerType === 'showText'" class="text-[11px] text-white/80 mt-1.5 leading-relaxed border-t border-white/20 pt-1.5">{{ msg.text }}</p>
                  <div v-if="msg.translatedText" class="text-[11px] text-white/70 mt-1 leading-relaxed border-t border-white/20 pt-1.5 italic">{{ msg.translatedText }}</div>
                  <div v-if="translatingIdx === idx" class="flex items-center gap-1.5 mt-1.5 text-[11px] text-white/60">
                    <span class="w-3 h-3 border-2 border-white/50 border-t-transparent rounded-full animate-spin"></span>
                    {{ $t('翻译中...') }}
                  </div>
                  <div v-if="msg.voiceProcessing" class="flex items-center gap-1.5 mt-1.5 text-[11px] text-white/60">
                    <span class="w-3 h-3 border-2 border-white/50 border-t-transparent rounded-full animate-spin"></span>
                    {{ $t('语音识别中...') }}
                  </div>
                </div>
                <!-- 文字消息 -->
                <div v-else class="rounded-2xl rounded-tr-md bg-blue-600 text-white px-4 py-3 shadow-sm shadow-blue-200/30">
                  <p class="text-[13px] whitespace-pre-wrap leading-relaxed">{{ msg.text }}</p>
                </div>
              </div>
            </div>

            <!-- Feedback -->
            <div v-else-if="msg.role === 'feedback'" class="flex items-start gap-3 max-w-2xl animate-fadeIn">
              <div class="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-sm mt-0.5">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              </div>
              <div class="min-w-0 rounded-2xl rounded-tl-md bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100/80 px-4 py-3 shadow-sm">
                <div class="flex items-center gap-3 mb-2">
                  <span class="text-xs font-bold px-2 py-0.5 rounded-full"
                    :class="(msg.score || 0) >= 70 ? 'bg-emerald-100 text-emerald-700' : (msg.score || 0) >= 40 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-600'">
                    {{ msg.score }}/100
                  </span>
                  <div class="flex-1 h-1 rounded-full bg-gray-200 overflow-hidden">
                    <div class="h-full rounded-full transition-all duration-700"
                      :class="(msg.score || 0) >= 70 ? 'bg-emerald-500' : (msg.score || 0) >= 40 ? 'bg-amber-500' : 'bg-red-400'"
                      :style="{ width: `${msg.score || 0}%` }" />
                  </div>
                </div>
                <p class="text-[13px] text-gray-700 whitespace-pre-wrap leading-relaxed">{{ msg.text }}</p>
              </div>
            </div>

            <!-- System -->
            <div v-else-if="msg.role === 'system'" class="text-center py-1 animate-fadeIn">
              <span class="inline-block px-4 py-1.5 rounded-full bg-gray-100 text-[11px] text-gray-400 font-medium">{{ msg.text }}</span>
            </div>
          </template>

          <!-- Typing indicator -->
          <div v-if="submitting" class="flex items-start gap-3 max-w-2xl">
            <div class="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[10px] font-bold mt-0.5">AI</div>
            <div class="rounded-2xl rounded-tl-md bg-white border border-gray-100 shadow-sm px-5 py-3">
              <div class="flex gap-1.5 items-center h-5">
                <span class="w-1.5 h-1.5 rounded-full bg-blue-300 animate-bounce" style="animation-delay: 0ms" />
                <span class="w-1.5 h-1.5 rounded-full bg-blue-300 animate-bounce" style="animation-delay: 150ms" />
                <span class="w-1.5 h-1.5 rounded-full bg-blue-300 animate-bounce" style="animation-delay: 300ms" />
              </div>
            </div>
          </div>
        </div>

        <!-- Input -->
        <div class="shrink-0 bg-white border-t border-gray-100">
          <!-- 简约倒计时 + 结束按钮（仅进行中显示） -->
          <div v-if="interview && interview.status !== 'completed'"
            class="max-w-2xl mx-auto px-6 pt-2.5 pb-1 flex items-center justify-between">
            <div class="flex items-center gap-2 text-[13px] font-mono tabular-nums"
              :class="timerPhase === 'safe' ? 'text-gray-500' : timerPhase === 'warn' ? 'text-amber-600' : 'text-red-600 font-semibold'">
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{{ totalCountdownDisplay }}</span>
              <span class="text-[11px] text-gray-400 font-sans">/ {{ formatTime(totalSecondsTotal) }}</span>
            </div>
            <button @click="() => handleEndInterview()" :disabled="ending"
              :title="$t('结束面试')"
              class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-medium bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 hover:border-red-300 transition disabled:opacity-50">
              <svg v-if="!ending" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 6h12v12H6z" /></svg>
              <svg v-else class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" class="opacity-25" /><path fill="currentColor" class="opacity-75" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" /></svg>
              <span>{{ ending ? $t('结束中...') : $t('结束面试') }}</span>
            </button>
          </div>
          <div v-if="interview?.status === 'completed'" class="px-6 py-5 text-center">
            <p class="text-sm text-gray-500 mb-3">
              {{ $t('面试已结束，总分') }}：<span class="text-2xl font-bold text-blue-600 mx-1">{{ interview.totalScore }}</span>/100
            </p>
            <button @click="goBack" class="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition shadow-sm shadow-blue-200">
              {{ $t('返回面试大厅') }}
            </button>
          </div>
          <div v-else-if="!currentQuestion" class="px-6 py-4 text-center text-sm text-gray-400">{{ $t('等待面试官提问...') }}</div>
          <div v-else class="px-6 py-3">
            <div class="flex items-end gap-2 max-w-2xl mx-auto">
              <div class="flex-1">
                <textarea
                  ref="inputRef"
                  v-model="inputText"
                  :placeholder="$t('输入你的回答...')"
                  rows="1"
                  class="w-full resize-none rounded-xl border border-gray-200 bg-gray-50/80 px-4 py-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition"
                  :class="{ 'opacity-50 pointer-events-none': submitting }"
                  @keydown.enter.exact="onEnterKey"
                  @input="autoResize"
                />
              </div>
              <button
                v-if="speechEnabled"
                @click="voiceRecording ? stopRecording() : startRecording()"
                class="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition"
                :class="voiceRecording ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-200' : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600'"
                :disabled="submitting"
              >
                <svg v-if="!voiceRecording" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" /></svg>
                <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 002 0V8a1 1 0 00-1-1zm4 0a1 1 0 00-1 1v4a1 1 0 002 0V8a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
              </button>
              <button
                @click="sendAnswer"
                :disabled="!inputText.trim() || submitting"
                class="shrink-0 w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center transition hover:bg-blue-700 disabled:opacity-30 shadow-sm shadow-blue-200"
              >
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
    <!-- 右键菜单 -->
    <Teleport to="body">
      <div v-if="ctxMenu.show" class="fixed inset-0 z-[999]" @click="hideCtxMenu" @contextmenu.prevent="hideCtxMenu">
        <div class="absolute bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 min-w-[140px] overflow-hidden"
          :style="{ left: ctxMenu.x + 'px', top: ctxMenu.y + 'px' }">
          <button @click="ctxShowText" class="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            {{ $t('转文字') }}
          </button>
          <button @click="ctxTranslate" class="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>
            {{ $t('翻译') }}
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, onUnmounted } from 'vue'
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'
import request from '@/utils/request'
import { confirmDialog } from '@/utils/confirm'
import { withPrivateFileToken } from '@/utils/private-file'
import { useI18n } from '@/i18n'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

interface ChatMessage {
  role: 'interviewer' | 'user' | 'feedback' | 'system'
  text: string
  score?: number
  answerType?: string
  questionIndex?: number
  voiceUrl?: string
  voiceDuration?: number
  voiceProcessing?: boolean
  translatedText?: string
}

const pageLoading = ref(true)
const interview = ref<any>(null)
const resume = ref<any>(null)
const chatMessages = ref<ChatMessage[]>([])
const inputText = ref('')
const submitting = ref(false)
const ending = ref(false)
const chatContainer = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLTextAreaElement | null>(null)
const speechEnabled = ref(false)
const voiceRecording = ref(false)
const voiceRecordStart = ref(0)
const playingVoiceIdx = ref(-1)
const ctxMenu = ref<{ show: boolean; x: number; y: number; idx: number }>({ show: false, x: 0, y: 0, idx: -1 })
const translatingIdx = ref(-1)
let mediaRecorder: MediaRecorder | null = null
let audioChunks: Blob[] = []
let currentAudio: HTMLAudioElement | null = null
let totalTimer: ReturnType<typeof setInterval> | null = null

// 总面试倒计时
const totalTimeLeft = ref(0)
const totalSecondsTotal = ref(0)

const totalCountdownDisplay = computed(() => {
  const s = totalTimeLeft.value
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${sec.toString().padStart(2, '0')}`
})

const totalTimerProgress = computed(() => {
  if (!totalSecondsTotal.value) return 0
  const used = totalSecondsTotal.value - totalTimeLeft.value
  return Math.max(0, Math.min(100, Math.round((used / totalSecondsTotal.value) * 100)))
})

const timerPhase = computed<'safe' | 'warn' | 'danger'>(() => {
  if (totalTimeLeft.value > 120) return 'safe'
  if (totalTimeLeft.value > 60) return 'warn'
  return 'danger'
})

function formatTime(s: number): string {
  if (s < 0) s = 0
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${sec.toString().padStart(2, '0')}`
}

function startTotalTimer(seconds: number, startedAt?: string | Date) {
  stopTotalTimer()
  totalSecondsTotal.value = seconds
  // 基于面试创建时间计算剩余秒数，刷新后也能恢复
  const startMs = startedAt ? new Date(startedAt).getTime() : Date.now()
  const computeLeft = () => {
    const elapsed = Math.floor((Date.now() - startMs) / 1000)
    return Math.max(0, seconds - elapsed)
  }
  totalTimeLeft.value = computeLeft()
  totalTimer = setInterval(() => {
    const left = computeLeft()
    totalTimeLeft.value = left
    if (left <= 0) {
      stopTotalTimer()
      if (interview.value && interview.value.status !== 'completed') {
        chatMessages.value.push({ role: 'system', text: t('面试时间已到，自动结束') })
        handleEndInterview(true)
      }
    }
  }, 1000)
}

function stopTotalTimer() {
  if (totalTimer) { clearInterval(totalTimer); totalTimer = null }
}

function playVoice(idx: number, url: string) {
  if (currentAudio) { currentAudio.pause(); currentAudio = null }
  if (playingVoiceIdx.value === idx) { playingVoiceIdx.value = -1; return }
  const audio = new Audio(withPrivateFileToken(url))
  audio.onended = () => { playingVoiceIdx.value = -1; currentAudio = null }
  audio.play()
  currentAudio = audio
  playingVoiceIdx.value = idx
}

function showVoiceCtxMenu(e: MouseEvent, idx: number) {
  e.preventDefault()
  ctxMenu.value = { show: true, x: e.clientX, y: e.clientY, idx }
}

function hideCtxMenu() { ctxMenu.value.show = false }

function ctxShowText() {
  const msg = chatMessages.value[ctxMenu.value.idx]
  if (msg?.voiceUrl && msg.text) {
    msg.answerType = 'showText'
  }
  hideCtxMenu()
}

async function ctxTranslate() {
  const msg = chatMessages.value[ctxMenu.value.idx]
  if (!msg?.text) { hideCtxMenu(); return }
  hideCtxMenu()
  translatingIdx.value = ctxMenu.value.idx
  try {
    const res: any = await request.post('/system/ai/translate', { text: msg.text })
    const translated = res.data?.text || res.text || ''
    if (translated) {
      ;(msg as any).translatedText = translated
    }
  } catch { /* silent */ }
  translatingIdx.value = -1
}

const userInitial = computed(() => {
  const info = JSON.parse(localStorage.getItem('userInfo') || '{}')
  return (info.nickname || info.username || 'U').charAt(0).toUpperCase()
})

const totalCount = computed(() => interview.value?.questionCount || 0)
const answeredCount = computed(() => interview.value?.answeredCount || 0)
const progress = computed(() => totalCount.value ? answeredCount.value / totalCount.value : 0)

const currentQuestion = computed(() => {
  if (!interview.value?.questions) return null
  return interview.value.questions.find((q: any) => !q.isAnswered)
})

async function goBack() {
  // 离开确认由 onBeforeRouteLeave 守卫统一处理
  router.push('/interview')
}

const leaveConfirmed = ref(false)

function scrollToBottom() {
  nextTick(() => {
    if (chatContainer.value) chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  })
}

function autoResize(e: Event) {
  const el = e.target as HTMLTextAreaElement
  el.style.height = 'auto'
  el.style.height = Math.min(el.scrollHeight, 120) + 'px'
}

function onEnterKey(e: KeyboardEvent) {
  if (!e.shiftKey) { e.preventDefault(); sendAnswer() }
}

function buildChatFromInterview(data: any) {
  const msgs: ChatMessage[] = []
  msgs.push({ role: 'system', text: t('面试开始') + (data.jobTitle ? ` — ${data.jobTitle}` : '') })

  if (data.questions) {
    for (const q of data.questions) {
      msgs.push({ role: 'interviewer', text: q.question, questionIndex: q.orderIndex })
      if (q.isAnswered) {
        const userMsg: ChatMessage = { role: 'user', text: q.answer, answerType: q.answerType }
        if (q.answerType === 'voice' && q.voiceUrl) {
          userMsg.voiceUrl = q.voiceUrl
          userMsg.voiceDuration = q.voiceDuration || 0
        }
        msgs.push(userMsg)
        if (q.feedback) msgs.push({ role: 'feedback', text: q.feedback, score: q.score })
      }
    }

    if (!data.questions.some((q: any) => !q.isAnswered) && data.status === 'completed') {
      msgs.push({ role: 'system', text: `${t('面试结束')}！${t('总分')}：${data.totalScore}/100` })
      if (data.overallFeedback) msgs.push({ role: 'interviewer', text: data.overallFeedback })
    }
  }
  chatMessages.value = msgs
}

async function loadInterview() {
  try {
    const res: any = await request.get(`/interview/${route.params.id}`)
    const data = res.data || res
    interview.value = data
    resume.value = data.resume || null
    buildChatFromInterview(data)
  } catch {
    chatMessages.value = [{ role: 'system', text: t('面试记录加载失败') }]
  } finally { pageLoading.value = false }
  // 如果面试未结束，启动总倒计时（基于 createdAt，刷新后能恢复）
  if (interview.value && interview.value.status !== 'completed') {
    const qc = Number(interview.value.questionCount) || 5
    const totalSeconds = Math.max(1, qc) * 3 * 60
    startTotalTimer(totalSeconds, interview.value.createdAt)
  }
  scrollToBottom()
}

async function sendAnswer() {
  const text = inputText.value.trim()
  if (!text || !currentQuestion.value || submitting.value) return

  const q = currentQuestion.value
  inputText.value = ''
  if (inputRef.value) inputRef.value.style.height = 'auto'

  chatMessages.value.push({ role: 'user', text, answerType: 'text' })
  scrollToBottom()

  submitting.value = true
  try {
    const res: any = await request.post(`/interview/${interview.value.id}/questions/${q.id}/answer`, { answer: text, answerType: 'text' })
    const result = res.data || res

    chatMessages.value.push({ role: 'feedback', text: result.feedback || t('评分完成'), score: result.score })

    q.isAnswered = true
    q.answer = text
    q.score = result.score
    q.feedback = result.feedback
    interview.value.answeredCount = (interview.value.answeredCount || 0) + 1

    if (result.followUp) {
      interview.value.questions.push({ ...result.followUp, isAnswered: false })
      // questionCount 为后端设定的目标题量，前端不再覆盖
      await new Promise(r => setTimeout(r, 800))
      chatMessages.value.push({ role: 'interviewer', text: result.followUp.question, questionIndex: result.followUp.orderIndex })
    } else {
      const nextQ = interview.value.questions.find((nq: any) => !nq.isAnswered)
      if (nextQ) {
        await new Promise(r => setTimeout(r, 800))
        chatMessages.value.push({ role: 'interviewer', text: nextQ.question, questionIndex: nextQ.orderIndex })
      } else {
        const detailRes: any = await request.get(`/interview/${interview.value.id}`)
        const detail = detailRes.data || detailRes
        interview.value.status = detail.status
        interview.value.totalScore = detail.totalScore
        interview.value.overallFeedback = detail.overallFeedback
        if (detail.status === 'completed') {
          chatMessages.value.push({ role: 'system', text: `${t('面试结束')}！${t('总分')}：${detail.totalScore}/100` })
          if (detail.overallFeedback) chatMessages.value.push({ role: 'interviewer', text: detail.overallFeedback })
        }
      }
    }
  } catch {
    chatMessages.value.push({ role: 'system', text: t('提交失败，请重试') })
  } finally { submitting.value = false }
  scrollToBottom()
  nextTick(() => inputRef.value?.focus())
}

async function handleEndInterview(skipConfirm = false) {
  if (!skipConfirm && !await confirmDialog(t('确定要提前结束面试吗？未回答的题目将不计分。'), { title: t('提前结束面试'), kind: 'danger', confirmText: t('结束面试'), description: t('结束后不可恢复，系统将立即生成总评与评分。') })) return
  ending.value = true
  stopTotalTimer()
  try {
    const res: any = await request.post(`/interview/${interview.value.id}/end`)
    const data = res.data || res
    interview.value.status = 'completed'
    interview.value.totalScore = data.totalScore
    interview.value.overallFeedback = data.overallFeedback
    chatMessages.value.push({ role: 'system', text: `${t('面试结束')}！${t('总分')}：${data.totalScore || 0}/100` })
    if (data.overallFeedback) chatMessages.value.push({ role: 'interviewer', text: data.overallFeedback })
  } catch {
    chatMessages.value.push({ role: 'system', text: t('结束面试失败') })
  } finally { ending.value = false }
  scrollToBottom()
}

async function blobToWav(blob: Blob): Promise<Blob> {
  const ctx = new AudioContext({ sampleRate: 16000 })
  const buf = await blob.arrayBuffer()
  const audio = await ctx.decodeAudioData(buf)
  const ch = audio.getChannelData(0)
  const wavBuf = new ArrayBuffer(44 + ch.length * 2)
  const view = new DataView(wavBuf)
  const sr = audio.sampleRate
  const writeStr = (o: number, s: string) => { for (let i = 0; i < s.length; i++) view.setUint8(o + i, s.charCodeAt(i)) }
  writeStr(0, 'RIFF'); view.setUint32(4, 36 + ch.length * 2, true); writeStr(8, 'WAVE')
  writeStr(12, 'fmt '); view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true)
  view.setUint32(24, sr, true); view.setUint32(28, sr * 2, true); view.setUint16(32, 2, true); view.setUint16(34, 16, true)
  writeStr(36, 'data'); view.setUint32(40, ch.length * 2, true)
  for (let i = 0; i < ch.length; i++) { const s = Math.max(-1, Math.min(1, ch[i])); view.setInt16(44 + i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true) }
  ctx.close()
  return new Blob([wavBuf], { type: 'audio/wav' })
}

async function startRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaRecorder = new MediaRecorder(stream)
    audioChunks = []
    voiceRecordStart.value = Date.now()
    mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) audioChunks.push(e.data) }
    mediaRecorder.onstop = () => { stream.getTracks().forEach(t => t.stop()); processVoice() }
    mediaRecorder.start()
    voiceRecording.value = true
  } catch { chatMessages.value.push({ role: 'system', text: t('无法访问麦克风，请检查权限设置') }) }
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') { mediaRecorder.stop(); voiceRecording.value = false }
}

async function processVoice() {
  if (!audioChunks.length) return
  const duration = Math.max(1, Math.round((Date.now() - voiceRecordStart.value) / 1000))
  const rawBlob = new Blob(audioChunks, { type: 'audio/webm' })
  let blob: Blob
  try { blob = await blobToWav(rawBlob) } catch { blob = rawBlob }
  const localUrl = URL.createObjectURL(blob)

  const voiceMsg: ChatMessage = {
    role: 'user',
    text: '',
    answerType: 'voice',
    voiceUrl: localUrl,
    voiceDuration: duration,
    voiceProcessing: true,
  }
  chatMessages.value.push(voiceMsg)
  scrollToBottom()

  submitting.value = true
  try {
    const isWav = blob.type === 'audio/wav'
    const fd = new FormData(); fd.append('file', blob, isWav ? 'voice.wav' : 'voice.webm')
    const up: any = await request.post('/system/speech/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    const recognizePath = up.data?.path || up.path
    const playbackUrl = up.data?.url || up.url || recognizePath
    if (!recognizePath && !playbackUrl) { voiceMsg.voiceProcessing = false; chatMessages.value.push({ role: 'system', text: t('语音处理失败') }); submitting.value = false; return }

    console.log('[Voice] Upload OK, path:', recognizePath || playbackUrl, 'isWav:', isWav, 'blobType:', blob.type, 'size:', blob.size)
    const rr: any = await request.post('/system/speech/recognize', { audioUrl: recognizePath || playbackUrl, format: isWav ? 'wav' : 'webm' })
    console.log('[Voice] Recognize response:', JSON.stringify(rr.data || rr))
    const text = rr.data?.text || rr.text || ''
    voiceMsg.voiceProcessing = false

    if (text) {
      voiceMsg.text = text
      if (!currentQuestion.value) { submitting.value = false; return }
      const q = currentQuestion.value
      try {
        const res: any = await request.post(`/interview/${interview.value.id}/questions/${q.id}/answer`, { answer: text, answerType: 'voice', voiceUrl: playbackUrl, voiceDuration: duration })
        const result = res.data || res
        chatMessages.value.push({ role: 'feedback', text: result.feedback || t('评分完成'), score: result.score })
        q.isAnswered = true; q.answer = text; q.score = result.score; q.feedback = result.feedback
        interview.value.answeredCount = (interview.value.answeredCount || 0) + 1

        if (result.followUp) {
          interview.value.questions.push({ ...result.followUp, isAnswered: false })
          await new Promise(r => setTimeout(r, 800))
          chatMessages.value.push({ role: 'interviewer', text: result.followUp.question, questionIndex: result.followUp.orderIndex })
        } else {
          const nextQ = interview.value.questions.find((nq: any) => !nq.isAnswered)
          if (nextQ) {
            await new Promise(r => setTimeout(r, 800))
            chatMessages.value.push({ role: 'interviewer', text: nextQ.question, questionIndex: nextQ.orderIndex })
          } else {
            const detailRes: any = await request.get(`/interview/${interview.value.id}`)
            const detail = detailRes.data || detailRes
            interview.value.status = detail.status
            interview.value.totalScore = detail.totalScore
            interview.value.overallFeedback = detail.overallFeedback
            if (detail.status === 'completed') {
              chatMessages.value.push({ role: 'system', text: `${t('面试结束')}！${t('总分')}：${detail.totalScore}/100` })
              if (detail.overallFeedback) chatMessages.value.push({ role: 'interviewer', text: detail.overallFeedback })
            }
          }
        }
      } catch {
        chatMessages.value.push({ role: 'system', text: t('提交失败，请重试') })
      }
    } else {
      const errMsg = rr.data?.message || rr.message || ''
      console.warn('[Voice] No text returned:', errMsg)
      chatMessages.value.push({ role: 'system', text: errMsg ? `${t('语音识别失败，请重试')} (${errMsg})` : t('语音识别未返回文本，请重试或切换文字输入') })
    }
  } catch (e: any) { console.error('[Voice] processVoice error:', e); voiceMsg.voiceProcessing = false; chatMessages.value.push({ role: 'system', text: `${t('语音处理失败')}: ${e?.message || ''}` }) }
  finally { submitting.value = false }
  scrollToBottom()
}

async function fetchSpeechConfig() {
  try {
    const res: any = await request.get('/system/settings/public')
    speechEnabled.value = ((res.data || res).voice_provider || 'disabled') !== 'disabled'
  } catch { speechEnabled.value = false }
}

onMounted(() => {
  loadInterview()
  fetchSpeechConfig()
  window.addEventListener('beforeunload', beforeUnloadHandler)
})
onUnmounted(() => {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop()
  stopTotalTimer()
  window.removeEventListener('beforeunload', beforeUnloadHandler)
})

function beforeUnloadHandler(e: BeforeUnloadEvent) {
  if (interview.value && interview.value.status !== 'completed') {
    e.preventDefault()
    e.returnValue = ''
  }
}

onBeforeRouteLeave(async (_to, _from, next) => {
  if (!interview.value || interview.value.status === 'completed' || leaveConfirmed.value) {
    next(); return
  }
  const ok = await confirmDialog(t('确定要离开面试吗？当前面试将保持进行中状态，你可以稍后回到面试列表继续。'), { title: t('离开面试？'), kind: 'warning', confirmText: t('离开'), description: t('倒计时仍会继续走表，超时后面试会自动结束。') })
  if (ok) { leaveConfirmed.value = true; next() } else { next(false) }
})
</script>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 0.35s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
.scrollbar-thin::-webkit-scrollbar { width: 4px; }
.scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
.scrollbar-thin::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 4px; }

.animate-voiceBar {
  animation: voiceBar 0.6s ease-in-out infinite alternate;
}
@keyframes voiceBar {
  0% { transform: scaleY(0.4); }
  100% { transform: scaleY(1.2); }
}

.animate-shimmer {
  animation: shimmer 2s linear infinite;
  background-size: 200% 100%;
}
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
</style>
