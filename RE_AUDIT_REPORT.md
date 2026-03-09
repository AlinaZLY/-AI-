# Campus Recruitment Platform — Re-Audit Report

**Date:** 2025-03-14  
**Scope:** server (NestJS), admin (Vue), client (Vue)  
**Objective:** Verify previous fixes and identify any new issues.

---

## Backend (server/src/)

### Check 1: roles.guard.ts — null check
**Status: PASS**  
- Line 27-28: `const { user } = context.switchToHttp().getRequest(); if (!user) return false;`  
- Null check exists and returns false when user is missing.

### Check 2: http-exception.filter.ts — Logger exists
**Status: PASS**  
- Logger is imported from `@nestjs/common` (line 12).  
- `private readonly logger = new Logger(HttpExceptionFilter.name);` (line 17).  
- **Note:** The logger is never used in the `catch` block (exceptions are not logged). Consider adding `this.logger.error(exception)` for debugging.

### Check 3: redis.service.ts — onModuleInit exists
**Status: PASS**  
- Implements `OnModuleInit` interface.  
- `onModuleInit()` (lines 21-31) pings Redis and sets error handler.

### Check 4: system.controller.ts — settings endpoint requires auth
**Status: PASS**  
- `GET /system/settings` (lines 27-32): `@UseGuards(JwtAuthGuard, RolesGuard)` + `@Roles(UserRole.ADMIN)`.  
- `GET /system/settings/public` (lines 35-38): No auth — intentional for public config.

### Check 5: system.service.ts — getPublicSettings and AI log limit
**Status: PASS**  
- `getPublicSettings()` (lines 107-116): Filters `SENSITIVE_KEYS` (ark_api_key, volc keys, voice keys).  
- `getAiCallLogs(limit)` (lines 298-304): `const safeLimit = Math.min(limit || 100, 500);` — capped at 500.

### Check 6: user.controller.ts — admin DTOs used
**Status: PASS**  
- `adminCreate` uses `AdminCreateUserDto` (line 50).  
- `adminUpdate` uses `AdminUpdateUserDto` (line 57).

### Check 7: admin-create-user.dto.ts and admin-update-user.dto.ts
**Status: PASS**  
- **AdminCreateUserDto:** `@Length(2,50)` username, `@Length(6,50)` password, `@IsEmail` email, `@Matches` phone, `@IsEnum` role.  
- **AdminUpdateUserDto:** `@Length`, `@IsEmail`, `@Matches`, `@IsEnum`, `@IsBoolean`, optional `@Length(6,50)` password.

### Check 8: auth.service.ts — email uniqueness check
**Status: PASS**  
- Lines 44-51: `if (email) { const existingByEmail = await this.userRepository.findOne({ where: { email } }); if (existingByEmail) throw new ConflictException('该邮箱已被注册'); }`

### Check 9: create-post.dto.ts — MaxLength
**Status: PASS**  
- Title: `@MaxLength(200)`.  
- Content: `@MaxLength(50000)`.

### Check 10: create-comment.dto.ts — MaxLength
**Status: PASS**  
- Content: `@MaxLength(5000)`.

### Check 11: application.service.ts — resumeId ownership check
**Status: PASS**  
- Lines 27-32: `if (dto.resumeId) { const resume = await this.resumeRepo.findOne(...); if (!resume || resume.userId !== userId) { throw new ForbiddenException('无权使用此简历'); } }`

### Check 12: interview.service.ts — seed data logic
**Status: PASS**  
- `onModuleInit()` seeds categories when `catCount === 0`.  
- Seeds questions from `seedQuestions` when `qCount < seedQuestions.length`.  
- Uses `existingSet` to avoid duplicates.

### Check 13: Additional security / validation / bugs
**Status: PARTIAL** — See "New Issues" below.

---

## Admin Frontend (admin/src/)

### Check 14: api/interview.ts — all 12 functions
**Status: PASS**  
- 12 functions: `getInterviewsAdminApi`, `getInterviewDetailAdminApi`, `deleteInterviewAdminApi`, `getInterviewStatsApi`, `getInterviewCategoriesApi`, `createInterviewCategoryApi`, `updateInterviewCategoryApi`, `deleteInterviewCategoryApi`, `getQuestionsApi`, `createQuestionApi`, `updateQuestionApi`, `deleteQuestionApi`.

### Check 15: BasicLayout.vue — "我的简历" menu and "访问首页" link
**Status: PASS**  
- "我的简历": `<a-menu-item key="resumes/my">` with `<span>我的简历</span>` (lines 67-70).  
- "访问首页": `<a-tooltip title="访问首页">` with `<a :href="clientBaseUrl" target="_blank" rel="noopener noreferrer">` (lines 162-166).

### Check 16: router/index.ts — afterEach document.title
**Status: PASS**  
- Lines 194-196: `router.afterEach((to) => { document.title = (to.meta?.title as string) || '校园招聘管理后台' })`

---

## Client Frontend (client/src/)

### Check 17: api/ directory — all modules
**Status: PASS**  
- Present: auth, user, community, job, application, resume, interview, company (8 modules).

### Check 18: utils/request.ts — router import and 401 handling
**Status: PASS**  
- `import router from '@/router'`.  
- 401 handler: removes token, shows toast, redirects to Login with `router.push({ name: 'Login', query: { redirect: currentPath } })`.

### Check 19: utils/toast.ts — no innerHTML
**Status: PASS**  
- Uses `iconSpan.textContent = c.icon` and `msgSpan.textContent = message`.  
- No `innerHTML`; XSS risk is avoided.

### Check 20: stores/user.ts — API imports
**Status: PASS**  
- Imports `loginApi`, `registerApi` from `@/api/auth`, `getProfileApi` from `@/api/user`.

### Check 21: router/index.ts — afterEach
**Status: PASS**  
- Lines 48-51: `router.afterEach((to) => { document.title = title ? \`${title} - AI校园招聘\` : 'AI校园招聘平台' })`

---

## New Issues Identified

### 1. **Interview resumeId ownership not validated** (Medium)
**File:** `server/src/modules/interview/interview.service.ts`  
**Issue:** `startInterview()` accepts `dto.resumeId` without checking that the resume belongs to the current user.  
**Risk:** Users can associate interviews with other users’ resumes.  
**Fix:** When `dto.resumeId` is provided, load the resume and verify `resume.userId === userId`; throw `ForbiddenException` if not.

### 2. **Admin create user — no email uniqueness check** (Medium)
**File:** `server/src/modules/user/user.service.ts`  
**Issue:** `adminCreateUser()` checks username uniqueness but not email.  
**Risk:** Duplicate emails if the DB allows, or constraint errors; inconsistent with `auth.service.register()`.  
**Fix:** If `data.email` is provided, check `existingByEmail` and throw `ConflictException` if taken.

### 3. **Admin update user — no email uniqueness check** (Medium)
**File:** `server/src/modules/user/user.service.ts`  
**Issue:** `adminUpdateUser()` does not check that a new email is unique.  
**Risk:** Two users can end up with the same email if admin updates one to match another.  
**Fix:** When `data.email` is present and different from current `user.email`, verify it is not used by another user.

### 4. **HttpExceptionFilter — Logger not used** (Low)
**File:** `server/src/common/filters/http-exception.filter.ts`  
**Issue:** Logger is instantiated but never called.  
**Impact:** Exceptions are not logged for debugging.  
**Fix:** Add `this.logger.error(exception?.message ?? exception, (exception as Error)?.stack)` in the catch block.

---

## Summary

| Category   | Pass | Fail | Notes                          |
|-----------|------|------|--------------------------------|
| Backend   | 12   | 0    | 4 new issues in Check 13       |
| Admin     | 3    | 0    |                                |
| Client    | 5    | 0    |                                |
| **Total** | **20** | **0** | All explicit checks passed    |

**Overall status:** All requested checks pass. Previous fixes (null check, Logger, Redis init, settings auth, public settings filter, AI log limit, admin DTOs, email uniqueness in register, MaxLength on post/comment, resumeId ownership in application, interview seed logic, toast `textContent`) are in place.  
**Action items:** Address the 4 new issues above (interview resumeId, admin create/update email uniqueness, Logger usage in filter) for improved security and observability.
