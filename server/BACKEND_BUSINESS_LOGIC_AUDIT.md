# NestJS Backend Business Logic Audit Report

**Audit Date:** 2025-03-14  
**Scope:** `server/src/modules/` — Resume, Job, Company, Community, Notification

---

## Executive Summary

This report documents security, validation, logic, and performance findings from a deep audit of five NestJS backend modules. **10 security/validation issues** and **4 logic/UX bugs** were identified.

---

## 1. Resume Module

### 1.1 Security ✅ Generally Sound

| Area | Status | Notes |
|------|--------|-------|
| Upload/analyze/optimize | ✅ | `saveFile`, `analyze`, `optimize`, `renderResume` all verify `{ id, userId }` before operations |
| Ownership | ✅ | `findOne`, `update`, `remove`, `duplicate`, `setDefault`, `saveFile` enforce user ownership |
| Template CRUD | ✅ | `createTemplate`, `updateTemplate`, `deleteTemplate`, `uploadTemplate` require `@Roles(ADMIN)` |

### 1.2 Issues Found

| Severity | Issue | Location | Details |
|----------|-------|----------|---------|
| **Medium** | `setDefault` silent failure | `resume.service.ts:136-138` | If resume doesn't exist or doesn't belong to user, second `update` affects 0 rows but still returns `{ message: '已设为默认简历' }`. User gets false success. |
| **Low** | Docx import no path traversal check | `resume.service.ts:337` | `mammoth.convertToHtml({ path: filePath })` uses controller-provided path. Controller uses multer destination — path is server-controlled, not user input. **Safe** but worth noting. |
| **Low** | Template `getTemplates`/`getTemplateDetail` no pagination cap | `resume.controller.ts:56-73` | Uses `pageSize || 20` with no `@Max()`. Caller could request very large pageSize (if DTO doesn't validate). |

### 1.3 Recommendations

- **setDefault:** Verify resume exists and belongs to user before update; throw `NotFoundException` if not.
- **getTemplates:** Add `@Max(100)` to pageSize (or use `PaginationDto`).

---

## 2. Job Module

### 2.1 Security ⚠️ Gaps

| Area | Status | Notes |
|------|--------|-------|
| Enterprise-only job creation | ❌ | No role check; any authenticated user (including students) can create jobs |
| companyId validation | ❌ | `CreateJobDto.companyId` accepted from client; no check that company belongs to user |
| Update/delete ownership | ✅ | `update` and `remove` enforce `job.userId === userId` when not admin |

### 2.2 Issues Found

| Severity | Issue | Location | Details |
|----------|-------|----------|---------|
| **High** | Anyone can create jobs | `job.controller.ts:56-59`, `job.service.ts:16-18` | `@Post()` has `JwtAuthGuard` only. Students can post jobs. Business rule likely requires enterprise role. |
| **High** | IDOR via companyId | `job.service.ts:17` | `create({ ...dto, userId })` includes `companyId` from DTO. Attacker can associate job with any company. |
| **Medium** | No pageSize limit (DoS) | `job.service.ts:60`, `QueryJobDto` | `QueryJobDto` has no `@Max()` on pageSize. `findAll` and `findAllAdmin` accept unbounded pageSize. |
| **Low** | `findOne` view count race | `job.service.ts:88-89` | `job.viewCount += 1` + `save()` — consider `increment()` for atomic update. |

### 2.3 Recommendations

- Restrict job creation to `ENTERPRISE` (and optionally require approved company).
- Validate `companyId`: must be null or match a company owned by the user.
- Add `@Max(100)` (or similar) to `QueryJobDto.pageSize` and enforce in service.
- Use `increment()` for view count.

---

## 3. Company Module

### 3.1 Security ✅ Mostly Sound

| Area | Status | Notes |
|------|--------|-------|
| Certification flow | ✅ | `create` one-per-user; `updateStatus` admin-only; `update` checks ownership |
| Admin approval | ✅ | `updateStatus` requires `@Roles(ADMIN)` |
| File upload | ⚠️ | See below |

### 3.2 Issues Found

| Severity | Issue | Location | Details |
|----------|-------|----------|---------|
| **Medium** | Cert upload not tied to company | `company.controller.ts:63-84` | `uploadCert` returns URL; any authenticated user can upload. No link to company. Attacker could fill storage or use for other purposes. |
| **Medium** | File type by extension only | `company.controller.ts:74-78` | `fileFilter` checks `.jpg|jpeg|png|gif|webp|pdf`. No magic-byte validation; renamed .exe could bypass. |
| **Low** | Unbounded pageSize | `QueryCompanyDto` | No `@Max()` on pageSize; same DoS risk as Job. |

### 3.3 Recommendations

- Consider rate limiting or quota on cert uploads per user.
- Add magic-byte validation for uploaded files.
- Add pageSize cap in `QueryCompanyDto`.

---

## 4. Community Module

### 4.1 Security ✅ Generally Sound

| Area | Status | Notes |
|------|--------|-------|
| Post delete/update ownership | ✅ | `updatePost` checks `post.userId === userId`; `deletePost` allows author or admin |
| Comment delete ownership | ✅ | `deleteComment` allows author or admin |
| Admin-only ops | ✅ | `reviewPost`, `togglePostEnabled`, `getAllComments`, category CRUD correctly require `@Roles(ADMIN)` |

### 4.2 Issues Found

| Severity | Issue | Location | Details |
|----------|-------|----------|---------|
| **Low** | `getPosts` status filter for non-admin | `community.service.ts:178-185` | Non-admin users always see `APPROVED` + `enabled` only; `query.status` ignored. Correct behavior. |
| **Low** | Category icon upload extension-only | `community.controller.ts:91-95` | Same as company: extension check only. |
| **Info** | `reviewPost` redundant role check | `community.service.ts:268-270` | Service checks `userRole !== ADMIN`; guard already enforces. Harmless redundancy. |

### 4.3 Performance

- `getPosts` uses batch queries for `likedIds`/`favoritedIds` — good.
- `getUserFavorites` uses `relations: ['post', 'post.user']` — acceptable.
- No obvious N+1 patterns identified.

### 4.4 Recommendations

- Add magic-byte validation for icon uploads if security posture requires it.
- `QueryPostDto` extends `PaginationDto` with `@Max(100)` — pagination is capped. ✅

---

## 5. Notification Module

### 5.1 Security ✅ Good

| Area | Status | Notes |
|------|--------|-------|
| User isolation | ✅ | All operations filter by `userId`. `getUserNotifications`, `markAsRead`, `markAllAsRead`, `deleteNotification`, `deleteAllRead` properly scoped. |

### 5.2 Issues Found

| Severity | Issue | Location | Details |
|----------|-------|----------|---------|
| **Low** | `markAsRead` silent on non-existent | `notification.service.ts:61-66` | Update with `{ id, userId }` may affect 0 rows. No error returned. Idempotent but could confuse client. |
| **Low** | pageSize capped in controller | `notification.controller.ts:26` | `Math.min(+(query.pageSize \|\| 20), 100)` — good; DTO still lacks `@Max()` for consistency. |

### 5.3 Recommendations

- Optionally return whether the notification existed for `markAsRead`.
- Add `@Max(100)` to `QueryNotificationDto.pageSize` for consistency.

---

## 6. Cross-Module Summary

### 6.1 Pagination / DoS

| Module | DTO | pageSize Limit | Risk |
|--------|-----|----------------|------|
| Job | QueryJobDto | None | High |
| Company | QueryCompanyDto | None | High |
| Community | QueryPostDto (PaginationDto) | @Max(100) | Low |
| Notification | QueryNotificationDto | None (controller caps at 100) | Low |
| Resume | Inline (page \|\| 1, pageSize \|\| 20) | None | Medium |

### 6.2 Route Order (Resume)

Resume controller route order is correct: `admin`, `templates`, `templates/categories`, `templates/:id`, `item/:id/*`, `:id` — more specific paths declared before generic `:id`.

---

## 7. Severity Legend

| Level | Definition |
|-------|-------------|
| **High** | Security/privacy impact; exploitable by authenticated user |
| **Medium** | Logic/UX flaw or weaker security control |
| **Low** | Minor issue or hardening opportunity |
| **Info** | Observation only |

---

## 8. Recommended Fix Priority

1. **P0:** Restrict job creation to enterprise users; validate `companyId` ownership.
2. **P1:** Add pageSize limits to Job and Company query DTOs.
3. **P2:** Fix Resume `setDefault` to verify and throw on non-existent/unauthorized.
4. **P3:** Add magic-byte checks for file uploads; consider upload quotas.

---

*Report generated from source code audit. Re-validate after implementing fixes.*
