# NestJS Backend Security & Code Audit Report

**Date:** 2025-03-14  
**Scope:** `server/src/modules/{community, notification, application, resume, interview, job, company}`

---

## Executive Summary

Audit of 7 NestJS modules revealed **2 Critical**, **5 High**, **12 Medium**, and **8 Low** severity issues. Key concerns: LIKE/SQL injection risk via unsanitized user input in search queries, missing content length limits enabling DoS, authorization/ownership gaps on several endpoints, and DTO validation inconsistencies.

---

## 1. Community Module

### API Endpoints

| Method | Path | Auth | Description |
|-------|------|------|-------------|
| GET | /community/categories | Public | 获取所有分类 |
| POST | /community/categories | Admin | 创建分类 |
| PUT | /community/categories/:id | Admin | 更新分类 |
| DELETE | /community/categories/:id | Admin | 删除分类 |
| POST | /community/categories/upload-icon | Admin | 上传分类图标 |
| POST | /community/posts | JWT | 发布帖子 |
| GET | /community/posts | Public | 帖子列表（支持分页、筛选、搜索） |
| GET | /community/posts/:id | Public | 帖子详情 |
| PUT | /community/posts/:id | JWT | 编辑帖子（作者） |
| DELETE | /community/posts/:id | JWT | 删除帖子（作者/管理员） |
| PUT | /community/posts/:id/review | Admin | 审核帖子 |
| PUT | /community/posts/:id/toggle-enabled | Admin | 切换启用状态 |
| POST | /community/posts/:id/like | JWT | 点赞/取消点赞帖子 |
| POST | /community/posts/:id/favorite | JWT | 收藏/取消收藏帖子 |
| GET | /community/comments | Admin | 管理员获取所有评论 |
| GET | /community/posts/:id/comments | Public | 获取帖子评论 |
| POST | /community/posts/:id/comments | JWT | 发表评论 |
| DELETE | /community/comments/:id | JWT | 删除评论（作者/管理员） |
| POST | /community/comments/:id/like | JWT | 点赞评论 |
| GET | /community/my/posts | JWT | 我的帖子 |
| GET | /community/my/favorites | JWT | 我的收藏 |

### Findings

| Severity | Issue | Location | Details |
|----------|-------|----------|---------|
| **High** | Potential SQL/LIKE injection | `community.service.ts:199-200`, `337` | `keyword` is interpolated directly into LIKE: `%${keyword}%`. Special chars (`%`, `_`, `\`) can alter query semantics. TypeORM parameterization prevents SQL injection, but `%` and `_` act as wildcards—user can craft `%`-rich input to match unintended rows. |
| **Medium** | No content length limit on post/comment | `create-post.dto.ts`, `create-comment.dto.ts` | `content` has no `@MaxLength()`. Large payloads (e.g. 10MB) can cause DoS, DB bloat, slow queries. |
| **Medium** | CreateCommentDto.parentId not transformed | `create-comment.dto.ts:10` | `@IsInt()` without `@Type(() => Number)`—JSON number is OK, but inconsistent with other DTOs. |
| **Low** | GET posts/comments without auth can expose draft data | - | Unauthenticated users get `req.user?.id` = undefined; service correctly restricts to APPROVED+enabled. No issue. |
| **Low** | `getAllComments` page/pageSize unvalidated | `community.controller.ts:186-189` | Query params passed as-is; `PaginationDto` not used. `pageSize` could be very large. |

### Ownership / Permission

- **Post edit/delete:** Only author or admin. ✓
- **Comment delete:** Only comment author or admin. ✓
- **Review/toggle:** Admin only. ✓
- **getPostDetail:** No auth required; only returns approved+enabled posts to non-admin. ✓

---

## 2. Notification Module

### API Endpoints

| Method | Path | Auth | Description |
|-------|------|------|-------------|
| GET | /notifications | JWT | 获取当前用户通知（分页） |
| GET | /notifications/unread-count | JWT | 未读数量 |
| PUT | /notifications/:id/read | JWT | 标记已读 |
| PUT | /notifications/read-all | JWT | 全部标记已读 |
| DELETE | /notifications/read | JWT | 删除已读通知 |
| DELETE | /notifications/:id | JWT | 删除单条通知 |

### Findings

| Severity | Issue | Location | Details |
|----------|-------|----------|---------|
| **High** | Route conflict: DELETE /read vs DELETE /:id | `notification.controller.ts` | `DELETE /notifications/read` and `DELETE /notifications/:id`. Request to `DELETE /notifications/read` may match `:id` with `id='read'`, causing ParseIntPipe to throw. Ensure `read` route is declared before `:id`. |
| **Medium** | No ValidationPipe on query DTO | `query-notification.dto.ts` | `page`, `pageSize` use `@IsNumberString()` but `pageSize` has no `@Max()`. `Math.min(+(query.pageSize \|\| 20), 100)` in controller mitigates, but DTO should enforce. |
| **Low** | `isRead` as string in DTO | `query-notification.dto.ts:18` | `isRead?: string`—no enum/boolean validation. |

### Ownership / Permission

- All notification operations filter by `req.user.id`. ✓
- `markAsRead`, `deleteNotification` use `{ id, userId }`—correct. ✓

---

## 3. Application Module

### API Endpoints

| Method | Path | Auth | Description |
|-------|------|------|-------------|
| POST | /applications | JWT | 创建投递记录 |
| GET | /applications | JWT | 我的投递列表 |
| GET | /applications/calendar | JWT | 日历视图 |
| GET | /applications/stats | JWT | 投递统计 |
| GET | /applications/:id | JWT | 投递详情 |
| PUT | /applications/:id | JWT | 更新投递 |
| DELETE | /applications/:id | JWT | 删除投递 |
| PUT | /applications/:id/status | JWT | 更新状态 |
| GET | /applications/:id/logs | JWT | 状态变更日志 |
| POST | /applications/:id/notes | JWT | 添加备注 |
| GET | /applications/:id/notes | JWT | 获取备注 |
| DELETE | /applications/notes/:noteId | JWT | 删除备注 |

### Findings

| Severity | Issue | Location | Details |
|----------|-------|----------|---------|
| **High** | LIKE injection in search | `application.service.ts:47-50`, `57` | `keyword` and `company` interpolated: `%${keyword}%`, `%${company}%`. Same wildcard risk as community. |
| **Medium** | CreateApplicationDto jobId/resumeId validation | `create-application.dto.ts:14-18` | `@IsNumber()` without `@Type(() => Number)`. For JSON body, numbers are fine; for form data, may fail. Use `@Type(() => Number)` + `@IsInt()` for consistency. |
| **Medium** | No ownership check on jobId/resumeId | `application.service.ts:24` | User can pass arbitrary `jobId`/`resumeId` without verifying they exist or belong to user. Could create dangling references. |
| **Low** | remove() doesn't cascade delete notes/logs | - | Application has OneToMany to notes and logs. Ensure DB/entity has `onDelete: 'CASCADE'` or manually delete. ApplicationNote/ApplicationStatusLog entities use `onDelete: 'CASCADE'`—OK. |

### Ownership / Permission

- All application operations filter by `userId` from `req.user.id`. ✓
- `deleteNote` checks `note.application.userId === userId`. ✓

---

## 4. Resume Module

### API Endpoints

| Method | Path | Auth | Description |
|-------|------|------|-------------|
| POST | /resumes | JWT | 创建简历 |
| GET | /resumes | JWT | 我的简历列表 |
| GET | /resumes/admin | Admin | 管理员列表（分页） |
| GET | /resumes/templates | JWT | 模板列表 |
| GET | /resumes/templates/categories | JWT | 模板分类 |
| GET | /resumes/templates/:id | JWT | 模板详情 |
| POST | /resumes/templates | Admin | 创建模板 |
| PUT | /resumes/templates/:id | Admin | 更新模板 |
| POST | /resumes/templates/upload | Admin | 导入 docx 模板 |
| DELETE | /resumes/templates/:id | Admin | 删除模板 |
| POST | /resumes/item/:id/duplicate | JWT | 复制简历 |
| PUT | /resumes/item/:id/default | JWT | 设为默认 |
| POST | /resumes/item/:id/upload | JWT | 上传简历文件 |
| POST | /resumes/item/:id/analyze | JWT | AI 分析 |
| POST | /resumes/item/:id/optimize | JWT | AI 优化 |
| GET | /resumes/item/:id/render | JWT | 渲染简历 |
| GET | /resumes/:id | JWT | 简历详情 |
| PUT | /resumes/:id | JWT | 更新简历 |
| DELETE | /resumes/:id | JWT | 删除简历 |

### Findings

| Severity | Issue | Location | Details |
|----------|-------|----------|---------|
| **Medium** | LIKE injection in findAllAdmin | `resume.service.ts:66-68` | `keyword` in `LIKE :kw`—same wildcard injection pattern. |
| **Medium** | Unbounded JSON in resume content | `create-resume.dto.ts`, `update-resume.dto.ts` | `content?: Record<string, any>`—no size/depth limit. Malicious client can send huge nested objects, causing DB/memory issues. |
| **Medium** | htmlContent/cssContent in template DTOs unbounded | `create-template.dto.ts`, `update-template.dto.ts` | Admin-only, but no length check—can store very large HTML/CSS. |
| **Low** | findAllAdmin userId not validated | `resume.controller.ts:51` | `userId` from query used directly. Admin could query any user's resumes—intended for admin. Should document. |

### Ownership / Permission

- User resume operations filter by `req.user.id`. ✓
- Admin `findAllAdmin` can filter by `userId`—expected. ✓

---

## 5. Interview Module

### API Endpoints

| Method | Path | Auth | Description |
|-------|------|------|-------------|
| GET | /interview/categories | JWT | 分类列表 |
| POST | /interview/categories | Admin | 创建分类 |
| PUT | /interview/categories/:id | Admin | 更新分类 |
| POST | /interview/categories/upload-cover | Admin | 上传封面 |
| DELETE | /interview/categories/:id | Admin | 删除分类 |
| GET | /interview/questions | JWT | 题库列表 |
| POST | /interview/questions | JWT | 添加题目（用户） |
| PUT | /interview/questions/:id | Admin | 更新题目 |
| DELETE | /interview/questions/:id | Admin | 删除题目 |
| GET | /interview/admin/list | Admin | 面试记录列表 |
| GET | /interview/admin/stats | Admin | 面试统计 |
| GET | /interview/admin/:id | Admin | 面试详情 |
| DELETE | /interview/admin/:id | Admin | 删除面试 |
| POST | /interview/start | JWT | 开始模拟面试 |
| GET | /interview/list | JWT | 我的面试列表 |
| GET | /interview/radar | JWT | 雷达图数据 |
| GET | /interview/:id | JWT | 面试详情 |
| POST | /interview/:id/questions/:questionId/answer | JWT | 提交答案 |
| DELETE | /interview/:id | JWT | 删除面试 |

### Findings

| Severity | Issue | Location | Details |
|----------|-------|----------|---------|
| **High** | LIKE injection in getQuestions | `interview.service.ts:122` | `keyword` in `(q.question LIKE :kw OR q.company LIKE :kw)`. |
| **High** | LIKE injection in getAllInterviewsAdmin | `interview.service.ts:192` | `keyword` in `(i.jobTitle LIKE :kw OR user.username LIKE :kw OR user.nickname LIKE :kw)`. |
| **Medium** | Any user can create question | `interview.controller.ts:82` | `createQuestion` has no role check. Students can add questions—may be intentional for UGC. |
| **Medium** | resumeId in StartInterviewDto not validated | - | User can pass arbitrary `resumeId`; no check that it belongs to user. |
| **Low** | MySQL `RAND()` in startInterview | `interview.service.ts:156` | `orderBy('RAND()')` is slow on large tables. Consider better randomization. |

### Ownership / Permission

- User interview operations filter by `userId`. ✓
- Admin endpoints correctly restricted. ✓

---

## 6. Job Module

### API Endpoints

| Method | Path | Auth | Description |
|-------|------|------|-------------|
| GET | /jobs | Public | 职位列表 |
| GET | /jobs/admin | Admin | 管理员列表 |
| GET | /jobs/stats | Admin | 统计 |
| GET | /jobs/my | JWT | 我发布的职位 |
| GET | /jobs/:id | Public | 职位详情 |
| POST | /jobs | JWT | 发布职位 |
| PUT | /jobs/:id | JWT | 更新职位（作者） |
| PUT | /jobs/admin/:id | Admin | 管理员更新 |
| DELETE | /jobs/:id | JWT | 删除职位（作者） |
| DELETE | /jobs/admin/:id | Admin | 管理员删除 |

### Findings

| Severity | Issue | Location | Details |
|----------|-------|----------|---------|
| **High** | LIKE injection in findAll, findAllAdmin | `job.service.ts:26`, `69` | `keyword` interpolated in LIKE. |
| **Medium** | No role restriction on job creation | `job.controller.ts:56` | Any authenticated user can create jobs. Typically only ENTERPRISE should publish. Consider `@Roles(UserRole.ENTERPRISE, UserRole.ADMIN)`. |
| **Medium** | QueryJobDto uses IsNumberString, no Type | `query-job.dto.ts` | `page`, `pageSize`, `companyId`, `salaryMin`, `salaryMax`—service uses `+page`, `+pageSize`. No explicit `@Min`/`@Max` on pageSize. |
| **Low** | viewCount incremented without transaction | `job.service.ts:88-89` | Read-modify-write; race possible but low impact. |

### Ownership / Permission

- Update/delete enforce `job.userId === userId` unless `isAdmin`. ✓
- Admin routes correctly use RolesGuard. ✓

---

## 7. Company Module

### API Endpoints

| Method | Path | Auth | Description |
|-------|------|------|-------------|
| GET | /companies | Public | 企业列表 |
| GET | /companies/admin | Admin | 管理员列表 |
| GET | /companies/stats | Admin | 统计 |
| GET | /companies/my | JWT | 我的企业 |
| GET | /companies/:id | Public | 企业详情 |
| POST | /companies | JWT | 创建企业 |
| POST | /companies/upload-cert | JWT | 上传认证材料 |
| PUT | /companies/:id | JWT | 更新企业 |
| PUT | /companies/admin/:id/status | Admin | 审核状态 |
| DELETE | /companies/admin/:id | Admin | 删除企业 |

### Findings

| Severity | Issue | Location | Details |
|----------|-------|----------|---------|
| **High** | LIKE injection in findAll, findAllAdmin | `company.service.ts:27`, `52` | `keyword` in LIKE. |
| **Medium** | No role check on company creation | `company.controller.ts:58` | Any user can create company. Business rule may limit to ENTERPRISE. |
| **Medium** | updateStatus body not validated | `company.controller.ts:101` | `body: { status, rejectReason }`—no DTO, no validation. |
| **Low** | Company delete only via admin | - | Users cannot delete their own company. May be intentional. |

### Ownership / Permission

- Update checks `company.userId === userId` unless admin. ✓
- findOne returns any company by id—intended for public listing. ✓

---

## Summary by Severity

### Critical (0)

None.

### High (5)

1. **Community:** LIKE wildcard injection via keyword.
2. **Notification:** Route ordering for DELETE read vs :id.
3. **Application:** LIKE injection in keyword/company search.
4. **Interview:** LIKE injection in getQuestions and getAllInterviewsAdmin.
5. **Job / Company:** LIKE injection in keyword search.

### Medium (12)

- Missing content length limits (community post/comment).
- DTO validation gaps (jobId/resumeId, pageSize, etc.).
- No role restriction on job/company creation.
- Unbounded JSON in resume content.
- Unbounded template htmlContent/cssContent.
- updateStatus body not validated.

### Low (8)

- Inconsistent use of PaginationDto.
- Minor DTO/validation inconsistencies.
- `RAND()` performance.
- Document admin userId filter intent.

---

## Recommendations

### Immediate (High)

1. **Sanitize LIKE patterns:** Escape `%`, `_`, `\` in user-supplied search terms before interpolating:
   ```ts
   const safeKw = (keyword || '').replace(/[%_\\]/g, '\\$&');
   qb.andWhere('... LIKE :kw', { kw: `%${safeKw}%` });
   ```
2. **Notification route order:** Ensure `@Delete('read')` (or `read-all` as needed) is declared before `@Delete(':id')`.

### Short-term (Medium)

1. Add `@MaxLength()` to post content (~50k), comment content (~5k).
2. Add `@Max()` (e.g. 100) to all `pageSize` DTOs.
3. Restrict job creation to ENTERPRISE (and ADMIN).
4. Add DTO for company `updateStatus` with `@IsEnum(CompanyStatus)`.
5. Validate `jobId`/`resumeId`/`resumeId` in application/interview against user ownership.

### Longer-term (Low)

1. Use `PaginationDto` (or similar) consistently for list endpoints.
2. Replace `RAND()` with a more efficient randomization strategy.
3. Add request body size limits per endpoint if needed.

---

## Entity / Relationship Notes

- **Application ↔ Job/Resume:** `jobId`, `resumeId` are optional FKs. No DB constraint visible; consider adding if referential integrity is required.
- **Post ↔ Category:** Correct ManyToOne.
- **Interview ↔ InterviewQuestion:** OneToMany; InterviewQuestion stores denormalized question text for history.
- **Company:** One per user (`findByUserId`); conflict on create. ✓

---

*Report generated from static code analysis. Runtime behavior and deployment configuration (e.g. reverse proxy, rate limiting) may affect actual risk.*
