# Frontend Audit Report
## Vue Admin & Client Applications

**Date:** 2025-03-14  
**Scope:** `admin/` and `client/` Vue 3 frontends

---

# 1. Admin Frontend (`admin/`)

## 1.1 Architecture and Code Organization

| Aspect | Assessment | Severity |
|--------|------------|----------|
| **Structure** | Clear separation: `api/`, `layouts/`, `views/`, `stores/`, `utils/`, `styles/` | OK |
| **API layer** | Dedicated `api/*.ts` per domain (auth, user, job, company, community, etc.) | OK |
| **Routing** | Nested routes under Layout, meta for auth/roles | OK |
| **State** | Pinia stores (user, system) | OK |

**Issues:**
- **High:** `admin/src/api/interview.ts` is incomplete. Views import `getQuestionsApi`, `createQuestionApi`, `updateQuestionApi`, `deleteQuestionApi`, `getInterviewCategoriesApi`, `createInterviewCategoryApi`, `updateInterviewCategoryApi`, `deleteInterviewCategoryApi`, but these functions are **not defined** in `interview.ts`. Only `getInterviewsAdminApi`, `getInterviewDetailAdminApi`, `deleteInterviewAdminApi`, `getInterviewStatsApi` exist. This will cause **runtime errors** in QuestionManage.vue and CategoryManageInterview.vue.
- **Medium:** No `api/` index for centralized exports.

---

## 1.2 Route Guard / Auth Handling

| Aspect | Assessment | Severity |
|--------|------------|----------|
| **Login redirect** | Unauthenticated users redirected to `/login?redirect=...` | OK |
| **Token check** | `localStorage.getItem('token')` in guard | OK |
| **Role check** | `meta.roles` checked against `userStore.userInfo?.role` | OK |
| **Post-login redirect** | Redirect to `Dashboard` if already logged in | OK |

**Issues:**
- **Low:** Router reads `localStorage` directly instead of syncing with Pinia `token` ref, so store and router can be out of sync.
- **Low:** When `fetchUserInfo` fails for role-protected routes, token is removed and user is sent to login—correct, but no user-friendly message before redirect.
- **Low:** Parent Layout has `requiresAuth: true`, but individual child routes do not define `requiresAuth`; relies on parent. This is fine but could be more explicit per route.

---

## 1.3 API Layer

| Aspect | Assessment | Severity |
|--------|------------|----------|
| **Base URL** | `/api` with proxy to `localhost:3000` | OK |
| **Token** | Request interceptor adds `Authorization: Bearer ${token}` | OK |
| **401 handling** | Clears token, redirects to login, shows message | OK |
| **Error messages** | `message.error()` for non-200 and network errors | OK |

**Issues:**
- **Medium:** Response interceptor expects `data.code === 200`. Non-200 responses are rejected; callers must handle `error.response?.data`—inconsistent error propagation.
- **Low:** No request/response logging or correlation IDs for debugging.
- **Low:** 10s timeout may be short for some operations (e.g. large uploads).
- **High:** Missing interview question/category APIs in `interview.ts` (see 1.1).

---

## 1.4 UI/UX Consistency

| Aspect | Assessment | Severity |
|--------|------------|----------|
| **Theme** | `global.less` + CSS vars (#1677ff primary) | OK |
| **Ant Design** | Overrides for primary buttons, inputs, menu | OK |
| **Layout** | BasicLayout with sider, header, content | OK |

**Issues:**
- **Medium:** "我的简历" (ResumeManage, `/resumes/my`) is defined in router with `meta: { parent: 'resume' }` but has **no sidebar menu entry**. The resume submenu only shows 模板管理 and 简历管理 (admin-only). Non-admin users cannot reach "我的简历" via UI.
- **Low:** Header "访问首页" uses `href="/"` which on port 3100 points to admin root. If client runs on a different origin/path, this may not open the intended client app.
- **Low:** `resume` submenu icon inconsistency (LayoutOutlined vs SolutionOutlined).

---

## 1.5 Missing/Incomplete Features

| Item | Severity |
|------|----------|
| Missing `getQuestionsApi`, `createQuestionApi`, `updateQuestionApi`, `deleteQuestionApi` in `interview.ts` | **Critical** |
| Missing `getInterviewCategoriesApi`, `createInterviewCategoryApi`, `updateInterviewCategoryApi`, `deleteInterviewCategoryApi` in `interview.ts` | **Critical** |
| "我的简历" route has no menu entry | **Medium** |
| No global loading indicator for slow API calls | Low |

---

## 1.6 TypeScript Usage

| Aspect | Assessment | Severity |
|--------|------------|----------|
| **Typing** | Vue files use `<script setup lang="ts">` | OK |
| **API params** | Many use `Record<string, any>` or `any` | Medium |
| **Store** | `userInfo` typed as `Record<string, unknown> \| null` | OK |
| **Form data** | `formData` often `Record<string, any>` | Low |

**Issues:**
- **Medium:** Heavy use of `any` (e.g. `res: any`, `record: any`) reduces type safety.
- **Low:** No shared types/interfaces for API responses; each view infers shape.

---

## 1.7 Component Design

| Aspect | Assessment |
|--------|------------|
| **Composition API** | Consistent use of `<script setup>` |
| **Reusability** | Views are page-level; little shared component extraction |
| **Props/Events** | Modal forms use local state; no prop drilling |

**Issues:**
- **Low:** Dashboard stat cards use inline SVG via `v-html`; could be components.
- **Low:** Repetitive table/CRUD patterns; could be abstracted into a generic data-grid.

---

## 1.8 Security

| Area | Assessment | Severity |
|------|------------|----------|
| **Token storage** | `localStorage` | Medium |
| **XSS - captcha** | `v-html` for backend SVG | OK (trusted source) |
| **XSS - post content** | `DOMPurify.sanitize()` in PostManage | OK |
| **XSS - dashboard icons** | `v-html` with hardcoded SVG | OK |
| **Sensitive data** | Test credentials (admin/admin123) visible in LoginView | Low |

**Issues:**
- **Medium:** JWT in `localStorage` is vulnerable to XSS; consider `httpOnly` cookies if backend supports it.
- **Low:** Exposing test credentials in UI is acceptable for dev, but should be disabled in production.

---

# 2. Client Frontend (`client/`)

## 2.1 Architecture and Code Organization

| Aspect | Assessment | Severity |
|--------|------------|----------|
| **Structure** | Flat: `views/`, `layouts/`, `stores/`, `utils/` | OK |
| **API layer** | No dedicated `api/` folder; components use `request` directly | Medium |
| **Routing** | Flat children under MainLayout | OK |

**Issues:**
- **Medium:** No API abstraction layer; endpoints and params scattered across views. Harder to maintain and refactor.
- **Low:** Fewer views than admin; structure is acceptable for current size.

---

## 2.2 Route Guard / Auth Handling

| Aspect | Assessment | Severity |
|--------|------------|----------|
| **Auth check** | `to.meta.requiresAuth` + `localStorage.getItem('token')` | OK |
| **Redirect** | Unauthenticated → `/login?redirect=...` | OK |
| **Post-login** | Login/Register → redirect to Home if token exists | OK |

**Issues:**
- **Low:** Same as admin: router reads `localStorage` directly instead of store.
- **Low:** No role-based routing (not required for client).

---

## 2.3 API Layer

| Aspect | Assessment | Severity |
|--------|------------|----------|
| **Base URL** | `/api`, proxy to 3000 | OK |
| **Token** | Request interceptor adds Bearer token | OK |
| **401** | Clears token, toast, `window.location.href` to login | OK |
| **Non-200** | `toast(..., 'error')`, reject | OK |

**Issues:**
- **Medium:** 401 handler uses `window.location.href`; full page reload, no SPA transition.
- **Low:** 30s timeout; reasonable.
- **Low:** Same `data.code !== 200` pattern as admin; error handling could be more consistent.

---

## 2.4 UI/UX Consistency

| Aspect | Assessment |
|--------|------------|
| **Styling** | Tailwind v4 via `@tailwindcss/vite` |
| **Layout** | MainLayout with nav, footer |
| **Responsive** | Mobile hamburger menu |

**Issues:**
- **Low:** No shared design tokens; Tailwind utilities used ad hoc.

---

## 2.5 Missing/Incomplete Features

| Item | Severity |
|------|----------|
| No `api/` folder or centralized API module | Medium |
| Register flow: no auto-login after registration; user must login again | Low |
| No captcha on RegisterView (if required by backend) | Low |

---

## 2.6 TypeScript Usage

| Aspect | Assessment |
|--------|------------|
| **Setup** | `lang="ts"` in script blocks |
| **Types** | Frequent `any` (e.g. `userInfo`, `res`) |
| **Stores** | `userInfo: ref<any>` |

**Issues:**
- **Medium:** Similar to admin: `any` used widely; type safety could be improved.

---

## 2.7 Component Design

| Aspect | Assessment |
|--------|------------|
| **Composition API** | Used consistently |
| **Inline logic** | API calls and form logic in views |
| **Shared** | Toast used across views |

**Issues:**
- **Low:** CommunityView, JobListView, etc. embed a lot of logic; could extract composables or components.

---

## 2.8 Security

| Area | Assessment | Severity |
|------|------------|----------|
| **Token storage** | `localStorage` | Medium |
| **XSS - toast** | `el.innerHTML = \`...${message}\`\` in toast.ts | **High** |
| **XSS - post content** | `DOMPurify.sanitize(post.content)` in PostDetailView | OK |
| **XSS - captcha** | `v-html` for backend SVG | OK |

**Issues:**
- **High:** `client/src/utils/toast.ts` line 19 uses `el.innerHTML = ... ${message} ...`. If `message` comes from API error responses or user input, this enables XSS. Must use `textContent` or escape/sanitize.
- **Medium:** Same `localStorage` token storage concern as admin.

---

# 3. Summary Matrix

| Category | Admin Issues | Client Issues |
|----------|--------------|---------------|
| **Critical** | Missing interview question/category APIs | Toast XSS (innerHTML) |
| **High** | - | - |
| **Medium** | "我的简历" no menu entry; response handling; `any` usage | No API layer; 401 full reload; `any` usage |
| **Low** | Token/store sync; timeout; test credentials | Register flow; design tokens |

---

# 4. Recommendations

## Immediate (Critical/High)

1. **Admin:** Add missing functions to `admin/src/api/interview.ts`:
   - `getQuestionsApi`, `createQuestionApi`, `updateQuestionApi`, `deleteQuestionApi`
   - `getInterviewCategoriesApi`, `createInterviewCategoryApi`, `updateInterviewCategoryApi`, `deleteInterviewCategoryApi`
2. **Client:** Fix toast XSS: replace `innerHTML` with `textContent` or safely escape `message`.

## Short-term (Medium)

3. **Admin:** Add "我的简历" to sidebar for non-admin users (or clarify if admin is admin-only and remove the route).
4. **Client:** Introduce an `api/` layer and move request calls there.
5. **Both:** Align error handling and improve typing (reduce `any`).

## Long-term (Low)

6. Consider `httpOnly` cookies for tokens.
7. Add API types/interfaces and stricter TS usage.
8. Disable or hide test credentials in production builds.
