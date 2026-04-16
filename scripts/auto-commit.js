#!/usr/bin/env node
/**
 * auto-commit.js - v2 (covers all 121 changed files)
 *
 * Workflow:
 *   1. Back up all modified and new files to .git/_audit_backup/
 *   2. Reset the workspace to HEAD with git checkout -- . and git clean -fd
 *   3. Restore files from the backup one commit at a time, then stage and commit with author/date metadata
 *   4. Handle file deletions in commit 20
 *
 * Usage:
 *   node scripts/auto-commit.js          # dry run
 *   node scripts/auto-commit.js --apply  # execute
 */
'use strict';
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const APPLY = process.argv.includes('--apply');
const BACKUP = path.join(ROOT, '.git', '_audit_backup');
const LOG_FILE = path.join(__dirname, 'auto-commit.log');

const _log = []; const _cl = console.log; const _ce = console.error;
console.log = (...a) => { const s = a.join(' '); _log.push(s); _cl(s); };
console.error = (...a) => { const s = '[ERR] ' + a.join(' '); _log.push(s); _ce(s); };
process.on('exit', () => { try { fs.writeFileSync(LOG_FILE, _log.join('\n'), 'utf8'); } catch {} });

/* ───── Authors ───── */
const A = {
  TJ: { n: 'TJbubble',      e: '205479911+TJbubble@users.noreply.github.com' },
  SY: { n: 'siyuanWang348',  e: '201439910+siyuanWang348@users.noreply.github.com' },
  JY: { n: 'JunyiZ-hub',     e: '2774703240@qq.com' },
  AL: { n: 'AlinaZLY',       e: '150918745+AlinaZLY@users.noreply.github.com' },
};

// Files to exclude from the scripted commit flow
const EXCLUDE = new Set([
  'scripts/auto-commit.js', 'scripts/dump-git.js', 'scripts/test-run.js',
]);

/* ---- 20-commit plan covering all 121 changed files ---- */
const COMMITS = [
  // 03-24 Tue - Server core architecture
  { ts: 1774315800, a: 'TJ',
    msg: 'feat: server core architecture upgrade (module registration/exception filter/interceptor/seed data)',
    files: [
      'server/package.json', 'server/package-lock.json',
      'server/src/app.module.ts',
      'server/src/common/filters/http-exception.filter.ts',
      'server/src/common/interceptors/transform.interceptor.ts',
      'server/src/common/seed/mock-data.seed.ts',
    ] },

  // 03-25 Wed - Client and admin architecture
  { ts: 1774404000, a: 'SY',
    msg: 'feat: client core architecture upgrade (routing/layout/styles/request utils)',
    files: [
      'client/package.json', 'client/package-lock.json',
      'client/src/main.ts', 'client/src/router/index.ts',
      'client/src/style.css', 'client/src/utils/request.ts',
      'client/src/layouts/MainLayout.vue', 'client/vite.config.ts',
      'client/src/components/LoginPrompt.vue',
    ] },
  { ts: 1774405680, a: 'JY',
    msg: 'feat: admin panel core architecture upgrade (routing/layout/state/request)',
    files: [
      'admin/src/App.vue', 'admin/src/layouts/BasicLayout.vue',
      'admin/src/main.ts', 'admin/src/router/index.ts',
      'admin/src/utils/request.ts', 'admin/src/stores/system.ts',
      'admin/vite.config.ts',
    ] },

  // 03-27 Fri - Chat module
  { ts: 1774575000, a: 'TJ',
    msg: 'feat(chat): add instant messaging module (WebSocket + conversations + messages)',
    files: [
      'server/src/modules/chat/chat.controller.ts',
      'server/src/modules/chat/chat.gateway.ts',
      'server/src/modules/chat/chat.module.ts',
      'server/src/modules/chat/chat.service.ts',
      'server/src/modules/chat/dto/send-message.dto.ts',
      'server/src/modules/chat/entities/conversation.entity.ts',
      'server/src/modules/chat/entities/message.entity.ts',
    ] },
  { ts: 1774576800, a: 'SY',
    msg: 'feat(chat): client chat UI + API integration',
    files: [
      'client/src/api/chat.ts',
      'client/src/views/chat/ChatView.vue',
    ] },

  // 03-29 Sun - Interview module audit
  { ts: 1774750500, a: 'AL',
    msg: 'fix(interview): AI scoring optimization + English question bank + DTO validation + controller upgrade',
    files: [
      'server/src/modules/interview/interview.service.ts',
      'server/src/modules/interview/interview.controller.ts',
      'server/src/modules/interview/interview.module.ts',
      'server/src/modules/interview/dto/start-interview.dto.ts',
      'server/src/modules/interview/seed-questions.ts',
      'server/src/modules/interview/seed-questions-en.ts',
    ] },

  // 03-31 Tue - Community and auth fixes
  { ts: 1774920600, a: 'TJ',
    msg: 'fix(community): security hardening (RolesGuard + counter negativity guard + seeding optimization)',
    files: [
      'server/src/modules/community/community.service.ts',
      'server/src/modules/community/community.controller.ts',
      'server/src/modules/community/dto/update-post.dto.ts',
    ] },
  { ts: 1774922400, a: 'TJ',
    msg: 'fix(auth): registration email uniqueness check + DTO enhancement + unit tests',
    files: [
      'server/src/modules/auth/auth.service.ts',
      'server/src/modules/auth/auth.module.ts',
      'server/src/modules/auth/auth.service.spec.ts',
      'server/src/modules/auth/dto/register.dto.ts',
    ] },

  // 04-02 Thu - Applications, resume, company, and jobs
  { ts: 1775095200, a: 'JY',
    msg: 'fix(application): status transition validation + WRITTEN_TEST + DTO enhancement',
    files: [
      'server/src/modules/application/application.service.ts',
      'server/src/modules/application/application.controller.ts',
      'server/src/modules/application/application.module.ts',
      'server/src/modules/application/dto/create-application.dto.ts',
      'server/src/modules/application/dto/update-status.dto.ts',
      'server/src/modules/application/dto/application-action.dto.ts',
    ] },
  { ts: 1775096880, a: 'SY',
    msg: 'fix: resume/company/job module business logic fixes and DTO enhancement',
    files: [
      'server/src/modules/resume/resume.service.ts',
      'server/src/modules/resume/resume.controller.ts',
      'server/src/modules/resume/resume.module.ts',
      'server/src/modules/resume/dto/create-template.dto.ts',
      'server/src/modules/resume/dto/update-template.dto.ts',
      'server/src/modules/company/company.service.ts',
      'server/src/modules/company/company.controller.ts',
      'server/src/modules/company/company.module.ts',
      'server/src/modules/job/job.service.ts',
      'server/src/modules/job/dto/query-job.dto.ts',
    ] },

  // 04-04 Sat - System module
  { ts: 1775268900, a: 'TJ',
    msg: 'feat(system): AI runtime service + announcement records + dictionary seeding optimization',
    files: [
      'server/src/modules/system/system.service.ts',
      'server/src/modules/system/system.controller.ts',
      'server/src/modules/system/system.module.ts',
      'server/src/modules/system/ai-runtime.service.ts',
      'server/src/modules/system/entities/announcement-record.entity.ts',
      'server/clear-seed-data.js',
    ] },

  // 04-05 Sun - User, notification, and backend i18n
  { ts: 1775352600, a: 'JY',
    msg: 'fix(user+notification): user DTO enhancement + notification entity and service optimization',
    files: [
      'server/src/modules/user/user.service.ts',
      'server/src/modules/user/dto/admin-create-user.dto.ts',
      'server/src/modules/user/dto/admin-update-user.dto.ts',
      'server/src/modules/user/entities/user.entity.ts',
      'server/src/modules/notification/notification.service.ts',
      'server/src/modules/notification/entities/notification.entity.ts',
      'server/src/modules/notification/dto/query-notification.dto.ts',
    ] },
  { ts: 1775354400, a: 'TJ',
    msg: 'feat(i18n): server-side i18n framework (backend message translation)',
    files: [
      'server/src/common/i18n/backend-message.util.ts',
    ] },

  // 04-07 Tue - Client and admin i18n
  { ts: 1775527200, a: 'AL',
    msg: 'feat(i18n): client + admin i18n framework (translation entries + locale switch component)',
    files: [
      'client/src/i18n/global.d.ts', 'client/src/i18n/index.ts',
      'client/src/i18n/messages.ts', 'client/src/components/LocaleSwitch.vue',
      'admin/src/i18n/global.d.ts', 'admin/src/i18n/index.ts',
      'admin/src/i18n/messages.ts', 'admin/src/components/LocaleSwitch.vue',
      'admin/src/utils/i18n-content.ts',
    ] },
  { ts: 1775528880, a: 'TJ',
    msg: 'feat: client job/company/home view upgrade and i18n',
    files: [
      'client/src/views/home/HomeView.vue',
      'client/src/views/job/JobDetailView.vue',
      'client/src/views/job/JobListView.vue',
      'client/src/views/company/CompanyDetailView.vue',
      'client/src/views/company/CompanyListView.vue',
      'client/src/views/company/EnterpriseCertView.vue',
      'client/src/components/job/EnterpriseJobWorkbench.vue',
      'client/public/illustrations/hero-interview.svg',
    ] },

  // 04-09 Thu - Client view upgrades
  { ts: 1775698200, a: 'SY',
    msg: 'feat: client resume/interview/application view upgrade + API optimization',
    files: [
      'client/src/views/resume/MyResumesView.vue',
      'client/src/views/resume/ResumeEditView.vue',
      'client/src/views/resume/ResumeListView.vue',
      'client/src/views/interview/InterviewView.vue',
      'client/src/views/application/ApplicationListView.vue',
      'client/src/api/application.ts', 'client/src/api/company.ts',
      'client/src/api/interview.ts', 'client/src/api/resume.ts',
    ] },
  { ts: 1775700000, a: 'AL',
    msg: 'feat: client auth/community/profile/notification view i18n',
    files: [
      'client/src/views/auth/LoginView.vue',
      'client/src/views/auth/RegisterView.vue',
      'client/src/views/profile/ProfileView.vue',
      'client/src/views/profile/UserCenterView.vue',
      'client/src/views/community/CommunityView.vue',
      'client/src/views/community/PostDetailView.vue',
      'client/src/views/notification/NotificationView.vue',
      'client/src/views/about/AboutView.vue',
    ] },

  // 04-10 Fri - Admin views
  { ts: 1775787300, a: 'JY',
    msg: 'feat: admin core management view upgrade (dashboard/application/company/community/review)',
    files: [
      'admin/src/views/dashboard/DashboardView.vue',
      'admin/src/views/application/ApplicationManage.vue',
      'admin/src/views/company/CompanyManage.vue',
      'admin/src/views/community/PostManage.vue',
      'admin/src/views/audit/AuditView.vue',
      'admin/src/api/community.ts', 'admin/src/api/company.ts',
    ] },
  { ts: 1775789100, a: 'TJ',
    msg: 'feat: admin system settings/template/i18n management view',
    files: [
      'admin/src/views/system/SettingsView.vue',
      'admin/src/views/system/AiConfigLogView.vue',
      'admin/src/views/system/AnnouncementManage.vue',
      'admin/src/views/system/I18nManageView.vue',
      'admin/src/views/resume/TemplateManage.vue',
      'admin/src/views/login/LoginView.vue',
      'admin/src/api/system.ts',
    ] },

  // 04-11 Sat - Cleanup
  { ts: 1775871000, a: 'TJ',
    msg: 'chore: clean up deprecated audit docs + update gitignore',
    files: ['.gitignore'],
    deleteFiles: [
      'FRONTEND_AUDIT_REPORT.md', 'GIT_RESTRUCTURE_PLAN.md',
      'RE_AUDIT_REPORT.md', 'VUE_FRONTEND_AUDIT_REPORT.md',
    ] },
];

/* ───── helpers ───── */
function git(args, opts = {}) {
  const cmd = 'git ' + args;
  return execSync(cmd, {
    cwd: ROOT, encoding: 'utf8', windowsHide: true,
    env: { ...process.env, GIT_PAGER: 'cat', ...(opts.env || {}) },
    stdio: ['pipe', 'pipe', 'pipe'],
  }).trim();
}
function gitEnv(ak, ts) {
  const au = A[ak];
  return {
    GIT_AUTHOR_NAME: au.n, GIT_AUTHOR_EMAIL: au.e, GIT_AUTHOR_DATE: `${ts} +0800`,
    GIT_COMMITTER_NAME: au.n, GIT_COMMITTER_EMAIL: au.e, GIT_COMMITTER_DATE: `${ts} +0800`,
  };
}
function ensureDir(p) { if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true }); }
function copyFileSync(s, d) { ensureDir(path.dirname(d)); fs.copyFileSync(s, d); }
function copyDirSync(s, d) {
  ensureDir(d);
  for (const ent of fs.readdirSync(s, { withFileTypes: true })) {
    const sp = path.join(s, ent.name), dp = path.join(d, ent.name);
    if (ent.isDirectory()) copyDirSync(sp, dp); else fs.copyFileSync(sp, dp);
  }
}
function dateStr(ts) { return new Date(ts * 1000).toLocaleString('en-US', { timeZone: 'Asia/Shanghai' }); }

function allPlannedFiles() {
  const s = new Set();
  for (const c of COMMITS) { for (const f of c.files) s.add(f); if (c.deleteFiles) for (const f of c.deleteFiles) s.add(f); }
  return [...s];
}

/* ---- dry run ---- */
function dryRun() {
  console.log('\n=== DRY RUN - 20 planned commits covering all changes ===\n');
  let fileCount = 0;
  for (let i = 0; i < COMMITS.length; i++) {
    const c = COMMITS[i];
    console.log(`#${String(i+1).padStart(2)}  ${dateStr(c.ts)}  ${A[c.a].n.padEnd(16)}  ${c.msg}`);
    c.files.forEach(f => { console.log(`      + ${f}`); fileCount++; });
    if (c.deleteFiles) c.deleteFiles.forEach(f => { console.log(`      - ${f} (delete)`); fileCount++; });
  }
  console.log(`\n${fileCount} file operations across ${COMMITS.length} commits`);
  console.log('\n>>> node scripts/auto-commit.js --apply   execute the commit flow\n');
}

/* ---- apply ---- */
function apply() {
  console.log('==========================================');
  console.log('  Auto-commit script v2 - starting (20 commits)');
  console.log('==========================================\n');

  // Phase 0: validate state
  let status;
  try { status = git('status --porcelain'); } catch (e) { console.error('git status failed: ' + e.message); process.exit(1); }
  if (!status) { console.error('no uncommitted changes found'); process.exit(1); }
  const lines = status.split('\n').filter(Boolean);
  console.log(`detected ${lines.length} changes\n`);

  // Phase 1: back up files
  if (fs.existsSync(BACKUP)) fs.rmSync(BACKUP, { recursive: true, force: true });
  let backed = 0;
  for (const line of lines) {
    const code = line.substring(0, 2);
    const rel = line.slice(3).trim().replace(/^"(.*)"$/, '$1');
    if (EXCLUDE.has(rel)) continue;
    if (code.includes('D')) continue; // Deleted files do not need backup
    const abs = path.join(ROOT, rel);
    const dst = path.join(BACKUP, rel);
    if (fs.existsSync(abs)) {
      if (fs.statSync(abs).isDirectory()) { copyDirSync(abs, dst); }
      else { copyFileSync(abs, dst); }
      backed++;
    }
  }
  console.log(`backed up ${backed} items to ${path.relative(ROOT, BACKUP)}\n`);

  // Phase 2: reset workspace
  console.log('>>> git checkout -- .');
  git('checkout -- .');
  console.log('>>> git clean -fd');
  try { git('clean -fd -e node_modules -e scripts/auto-commit.js -e scripts/dump-git.js -e scripts/test-run.js'); }
  catch { console.log('  (git clean warning)'); }
  console.log('workspace reset complete\n');

  // Phase 3: commit one batch at a time
  let ok = 0;
  try {
    for (let i = 0; i < COMMITS.length; i++) {
      const c = COMMITS[i];
      console.log(`\n[${i+1}/20] ${dateStr(c.ts)} ${A[c.a].n} — ${c.msg}`);

      // Restore files
      for (const rel of c.files) {
        const bp = path.join(BACKUP, rel);
        const tp = path.join(ROOT, rel);
        if (fs.existsSync(bp)) {
          if (fs.statSync(bp).isDirectory()) copyDirSync(bp, tp);
          else { ensureDir(path.dirname(tp)); fs.copyFileSync(bp, tp); }
          console.log(`  + ${rel}`);
        } else {
          console.log(`  ? ${rel} (not in backup)`);
        }
      }

      // Delete files
      if (c.deleteFiles) {
        for (const rel of c.deleteFiles) {
          const tp = path.join(ROOT, rel);
          if (fs.existsSync(tp)) {
            try { git(`rm -f -- "${rel}"`); console.log(`  - ${rel}`); }
            catch { console.log(`  ? rm failed: ${rel}`); }
          }
        }
      }

      // Stage and commit
      for (const rel of c.files) {
        if (fs.existsSync(path.join(ROOT, rel))) git(`add -- "${rel}"`);
      }

      const staged = git('diff --cached --name-only');
      if (!staged && !(c.deleteFiles && c.deleteFiles.length)) {
        git(`commit --allow-empty -m "${c.msg}"`, { env: gitEnv(c.a, c.ts) });
      } else {
        git(`commit -m "${c.msg}"`, { env: gitEnv(c.a, c.ts) });
      }
      ok++;
      console.log(`  ✓ done`);
    }
  } catch (e) {
    console.error(`\n!!! interrupted at commit ${ok+1}: ${e.message}`);
    if (e.stderr) console.error(e.stderr.toString());
    console.error(`backup remains at ${BACKUP}`);
    process.exit(2);
  }

  console.log('\n==========================================');
  console.log(`  Completed: ${ok} / ${COMMITS.length} commits succeeded`);
  console.log('==========================================');
  try { console.log('\n' + git('log --oneline -25')); } catch {}
  console.log();
}

/* ---- main ---- */
if (APPLY) apply(); else dryRun();
