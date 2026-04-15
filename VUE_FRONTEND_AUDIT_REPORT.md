# Vue Frontends Audit Report

**Date:** 2025-03-14  
**Scope:** Admin + Client Vue frontends at `d:\danzi\基于 AI 的校园招聘服务平台\-AI-\`  
**Views Audited:** 9 admin views, 8 client views + MainLayout

---

## Executive Summary

| Category          | Admin | Client | Notes |
|-------------------|-------|--------|-------|
| Error Handling    | 15+   | 20+    | Many silent `catch {}` blocks; toast may depend on interceptor |
| Loading States   | Good  | Good   | Most tables/lists have loading |
| XSS Risks         | 2     | 2      | PostDetailView uses DOMPurify; TemplateManage depends on DOMPurify; others reviewed |
| UI/UX / Broken    | 8     | 12     | Missing states, empty drawers, inconsistent behavior |
| API Issues        | 2     | 4      | Endpoint / param mismatches, response shape assumptions |

---

## 1. Admin Frontend

### 1.1 CompanyManage.vue

| Check | Status | Details |
|-------|--------|---------|
| Error handling | Partial | `fetchStats()` has empty catch `catch {}`; others use `message.error()` |
| Loading | ✓ | Table uses `:loading="loading"` |
| XSS | ✓ | No `v-html`; text interpolation only |
| UI/UX | Issues | `handleReject(id)` uses native `prompt()` — poor UX; duplicate reject flow (prompt vs modal textarea) |
| API | ✓ | Uses `getCompaniesAdminApi`, `updateCompanyStatusApi(id, status, reason)` correctly |

**Findings:**
- `handleReject()` (row action) uses `prompt()` while modal has `handleRejectWithReason()`; inconsistent UX
- Stats fetch fails silently (`catch {}`)
- Reject reason not validated on `handleReject()` (user can cancel but no validation of empty input before API call)

---

### 1.2 JobManage.vue

| Check | Status | Details |
|-------|--------|---------|
| Error handling | Partial | `fetchStats()` empty catch |
| Loading | ✓ | Table + form loading states |
| XSS | ✓ | No `v-html` |
| UI/UX | Minor | `deadline` uses `<a-input type="date">`; Ant Design recommends `DatePicker` |
| API | ✓ | Correct |

**Findings:**
- Stats fetch fails silently
- Form lacks `companyId` — uses `companyName` only; may not link to company entity if backend expects `companyId`

---

### 1.3 ResumeAdminView.vue

| Check | Status | Details |
|-------|--------|---------|
| Error handling | ✓ | `message.error()` on fetch and preview |
| Loading | ✓ | Table loading |
| XSS | High | **`window.document.write(html)`** — server HTML written directly without sanitization |
| UI/UX | Minor | Preview opens new window; no loading during preview |
| API | ✓ | `getResumesAdminApi`, `renderResumeApi` |

**Findings:**
- **XSS risk:** `renderResumeApi` returns HTML; written to new window via `w.document.write(html)`. If backend returns unsanitized user content, XSS possible. Recommend server-side sanitization or client DOMPurify before write
- No loading indicator during preview
- `userIdFilter` sent as string; backend may expect number for `userId` param

---

### 1.4 TemplateManage.vue

| Check | Status | Details |
|-------|--------|---------|
| Error handling | Partial | `fetchCategories()` empty catch; `openEditModal` falls back to record if API fails |
| Loading | ✓ | `a-spin` |
| XSS | Partial | Uses `DOMPurify` when available: `(window as any).DOMPurify` — **fragile**; if DOMPurify not loaded, falls back to raw HTML |
| UI/UX | Minor | `handlePageChange` receives `page` but `handleSizeChange` signature `(_, size)` may confuse |
| API | ✓ | Correct |

**Findings:**
- **DOMPurify dependency:** `buildPreviewHtml` and `handlePreview` use `(window as any).DOMPurify`; if not loaded globally, raw HTML used — XSS risk
- `sandbox=""` on iframe is minimal; consider `sandbox="allow-same-origin"` for styling only if needed
- CSS strip: `replace(/<\/?script[^>]*>/gi, '')` — weak; `url()`, `expression()` in CSS could still run

---

### 1.5 ApplicationManage.vue

| Check | Status | Details |
|-------|--------|---------|
| Error handling | ✓ | `message.error()` in catch blocks |
| Loading | ✓ | Table loading |
| XSS | ✓ | No `v-html` |
| UI/UX | Issues | Drawer opens before API completes; on failure `currentApp` stays null, drawer shows empty; status change in table does not refresh drawer |
| API | Mismatch | `getApplicationsApi` vs admin likely `/admin/applications` — **verify admin base path** |

**Findings:**
- `showDetail()` sets `detailVisible = true` then fetches; on API error `currentApp` never set → empty drawer
- After `handleStatusChange`, drawer's `currentApp` not refreshed
- `handleFormSubmit` form lacks `status` field; create/edit may not set process status
- Add-note API: `addApplicationNoteApi(id, { type, content })` — correct

---

### 1.6 AiConfigView.vue

| Check | Status | Details |
|-------|--------|---------|
| Error handling | Partial | `fetchConfig()` empty catch; config may stay default on error |
| Loading | ✓ | Buttons have `:loading` |
| XSS | ✓ | No `v-html` |
| UI/UX | Minor | Billing tab: `billingMonth.format?.('YYYY-MM')` — dayjs/moment; ensure library loaded |
| API | ✓ | Uses `request` directly for `/system/ai-test`, `/system/billing`, `/system/balance` |

**Findings:**
- Config fetch fails silently; user may edit without loading saved config
- `billingMonth.value.format?.('YYYY-MM')` — verify `billingMonth` is dayjs object
- Test connection warns "请先保存配置后再测试" but uses current form values, not saved — confusing

---

### 1.7 AiConfigKeyView.vue

| Check | Status | Details |
|-------|--------|---------|
| Error handling | Partial | Same as AiConfigView |
| Loading | ✓ | ✓ |
| XSS | ✓ | ✓ |
| UI/UX | Minor | Subset of AiConfigView (no billing tab); duplicated logic |
| API | ✓ | ✓ |

**Findings:**
- Duplicate of AiConfigView with fewer tabs; consider merging or component reuse

---

### 1.8 NotificationView.vue

| Check | Status | Details |
|-------|--------|---------|
| Error handling | ✓ | `message.error()` used |
| Loading | ✓ | `a-spin` |
| XSS | Low | `item.content` from API — if rendered as HTML, risk; currently text only |
| UI/UX | Minor | `readFilter` value `"false"` (string) for "未读" — API may expect boolean |
| API | Check | `getNotificationsApi({ isRead: readFilter.value })` — `isRead: "false"` vs `false`; backend type may differ |

**Findings:**
- `isRead: readFilter.value || undefined` — when "未读", `readFilter = "false"`; backend must accept string
- Pagination `@change` vs `@showSizeChange` — `handlePageChange` only; size change may not refetch

---

### 1.9 UserManage.vue

| Check | Status | Details |
|-------|--------|---------|
| Error handling | ✓ | Uses `e?.response?.data?.message` for server message |
| Loading | ✓ | ✓ |
| XSS | ✓ | No `v-html` |
| UI/UX | Minor | Modal without `destroy-on-close`; form may retain previous user data when reopening |
| API | ✓ | Correct |

**Findings:**
- `handleToggle` has no loading; switch toggles immediately, revert on error could be confusing
- Form reset in `openCreateModal`/`openEditModal` but modal not `destroy-on-close` — usually fine with explicit reset

---

## 2. Client Frontend

### 2.1 HomeView.vue

| Check | Status | Details |
|-------|--------|---------|
| Error handling | N/A | Static content, no API |
| Loading | N/A | N/A |
| XSS | ✓ | No dynamic HTML |
| UI/UX | ✓ | Simple landing |
| API | N/A | N/A |

**Findings:** No issues.

---

### 2.2 ResumeListView.vue

| Check | Status | Details |
|-------|--------|---------|
| Error handling | Partial | Many `catch {}` rely on interceptor; `createResume` comment "toast handled by interceptor" — verify interceptor covers all cases |
| Loading | ✓ | ✓ |
| XSS | High | **`win.document.write(html)`** — same as ResumeAdminView; server HTML unsanitized |
| UI/UX | Issues | `openCreateModal` sets `newResume.templateId = templates.value[0]?.id`; if templates empty, `undefined`; template optional in select |
| API | Mismatch | Uses `/resumes`, `/resumes/item/${id}/render` — client API uses `/resumes/${id}` for get; **check base path** |

**Findings:**
- Preview HTML written without sanitization — XSS risk
- `editForm.content` — if `content.basicInfo` undefined, `editForm.content.basicInfo.name` can throw
- `openCreateModal` default template logic may be confusing when no templates

---

### 2.3 InterviewView.vue

| Check | Status | Details |
|-------|--------|---------|
| Error handling | Poor | All catches empty: `catch {}` — user gets no feedback on start, open, submit, fetch |
| Loading | ✓ | ✓ |
| XSS | ✓ | No `v-html` |
| UI/UX | Issues | `openInterview` on error leaves `currentInterview` stale; `answerTexts` not cleared when switching interviews |
| API | ✓ | `/interview/start`, `/interview/${id}`, `/interview/list` |

**Findings:**
- **No error feedback** for start interview, load detail, submit answer, fetch list
- `answerTexts` keyed by `q.id`; when changing interview, old keys remain — potential stale input
- `startInterview` success sets `currentInterview = res.data` — if backend returns list vs single, may break

---

### 2.4 ApplicationListView.vue

| Check | Status | Details |
|-------|--------|---------|
| Error handling | Partial | `fetchStats`, `fetchList`, `addNote`, `deleteNote`, `handleCreate`, `handleEdit`, `handleDelete` — all empty catch; rely on interceptor |
| Loading | ✓ | ✓ |
| XSS | ✓ | No `v-html` |
| UI/UX | Issues | Create form lacks `status`, `tag`, `nextDate`; edit form has them; `jobDescription` in create not sent — stored? |
| API | Check | `addNote` sends `{ content }` only; admin sends `{ type, content }` — backend may ignore type |

**Findings:**
- Create form: `jobDescription` in form but not in `handleCreate` payload — **omitted**
- Many silent catches; if interceptor doesn't show toast, user gets no feedback
- `changeStatus` reverts `app.status = oldStatus` on error — good
- Stats `byStatus`/`byTag` may return `count` as string; `+x.count` handles it

---

### 2.5 EnterpriseCertView.vue

| Check | Status | Details |
|-------|--------|---------|
| Error handling | Partial | `onMounted` empty catch; `handleFileUpload`, `handleSubmit` use toast |
| Loading | ✓ | `submitting` on submit |
| XSS | ✓ | No `v-html` |
| UI/UX | Issues | No loading on initial fetch; `company` stays null on error; form may show empty |
| API | ✓ | `/companies/my`, `/companies/upload-cert`, `/companies` |

**Findings:**
- Initial load: empty catch → no toast; user may not know load failed
- Individual type: `idCardFront` and `idCardBack` required for all; for `company` type, IDs might be optional per business rules
- `(form as any)[uploadField]` — type assertion; works but brittle

---

### 2.6 ProfileView.vue

| Check | Status | Details |
|-------|--------|---------|
| Error handling | ✓ | `toast()` on load, save, avatar, password |
| Loading | ✓ | `saving`, `changingPassword` |
| XSS | ✓ | No `v-html` |
| UI/UX | Minor | No file size check on avatar; `onAvatarChange` should validate (e.g. 10MB) |
| API | ✓ | `/user/profile`, `/user/avatar`, `/user/password` |

**Findings:**
- Avatar upload: no size validation (UI says "最大 10MB" but not enforced)
- No validation for image type beyond `accept`

---

### 2.7 PostDetailView.vue

| Check | Status | Details |
|-------|--------|---------|
| Error handling | Partial | `fetchComments`, `submitComment`, `toggleLike`, `toggleFavorite`, `onMounted` — empty catches |
| Loading | Partial | No loading for post fetch; `submitting` for comment only |
| XSS | Mitigated | Uses `DOMPurify.sanitize(post.content)` before `v-html` — **correct** |
| UI/UX | Issues | Post fetch fails silently; `post` stays null, page shows nothing (or `v-if="post"` hides all) |
| API | ✓ | `/community/posts/${id}`, `/community/posts/${id}/comments` |

**Findings:**
- **XSS:** Correct use of DOMPurify for post content
- Post fetch error: no toast; blank page
- Comment length: `commentText.length}/500` — no `maxlength` or backend validation check in UI
- Route param `id` — if invalid, 404 not handled

---

### 2.8 MainLayout.vue

| Check | Status | Details |
|-------|--------|---------|
| Error handling | ✓ | `userStore.fetchUserInfo().catch(() => {})` — intentional swallow |
| Loading | N/A | N/A |
| XSS | ✓ | No `v-html` |
| UI/UX | ✓ | Nav, mobile menu |
| API | N/A | N/A |

**Findings:** No issues.

---

## 3. Cross-Cutting Issues

### 3.1 XSS Summary

| Location | Usage | Risk | Recommendation |
|----------|-------|------|----------------|
| PostDetailView.vue | `v-html="sanitize(post.content)"` | Low | ✓ DOMPurify used |
| TemplateManage.vue | `buildPreviewHtml`, `handlePreview` | Medium | DOMPurify via `(window as any)` — ensure it's loaded; fallback unsafe |
| ResumeAdminView.vue | `w.document.write(html)` | High | Sanitize server HTML or use DOMPurify before write |
| ResumeListView.vue | `win.document.write(html)` | High | Same as above |

### 3.2 Error Handling Pattern

- **Admin:** Uses `message.error()` in most catch blocks
- **Client:** Many empty `catch {}`; relies on axios interceptor
- **Risk:** If interceptor doesn't show toast for some errors (e.g. 422, 500 with non-standard shape), user gets no feedback
- **Recommendation:** Add explicit `toast()` or `message.error()` in critical catch blocks, or document interceptor behavior

### 3.3 API Base Paths

- Admin: `/api` expected (from request utils)
- Client: `/api` baseURL
- Verify: Admin and client may call different routes (e.g. `/applications` vs `/admin/applications`) depending on backend

### 3.4 Response Shape Assumptions

- Many views use `res.data?.list`, `res.data` or `res?.data ?? res` inconsistently
- Backend may return `{ data: { list, total } }` or `{ list, total }` — align contract

---

## 4. Recommendations

### High Priority

1. **ResumeAdminView / ResumeListView:** Sanitize HTML before `document.write` (DOMPurify or server-side)
2. **TemplateManage:** Ensure DOMPurify is loaded; remove unsafe fallback when absent
3. **InterviewView:** Add error feedback (toast) in all catch blocks
4. **PostDetailView:** Add error handling and loading for post fetch
5. **EnterpriseCertView:** Add loading and error toast for initial fetch

### Medium Priority

6. **ApplicationManage:** Set `currentApp` from `record` before API call so drawer has basic data; or show loading in drawer
7. **CompanyManage:** Replace `prompt()` with modal for reject reason
8. **ApplicationListView:** Add `jobDescription` to create payload if backend expects it
9. **ProfileView:** Add avatar file size check (10MB)
10. **NotificationView:** Fix `isRead` type (string vs boolean) and pagination size-change handling

### Low Priority

11. **AiConfigView / AiConfigKeyView:** Add error handling for config fetch; fix test-button copy
12. **UserManage:** Add loading/feedback for toggle switch
13. **ResumeListView:** Guard `editForm.content.basicInfo` before access
14. Unify response handling (`res.data` vs `res`) across views

---

## 5. Verification Checklist

- [ ] DOMPurify loaded before TemplateManage
- [ ] Resume render API returns sanitized HTML
- [ ] Client request interceptor shows toast for all error responses
- [ ] Admin ApplicationManage uses correct admin application routes
- [ ] Notification API accepts `isRead` as string `"true"`/`"false"`
- [ ] Application create payload includes all required fields per backend

---

*Report generated from source code review. Backend API contracts should be verified separately.*
