import request from '@/utils/request'

// ==================== 分类管理 ====================

/** 获取所有分类 */
export function getCategoriesApi() {
  return request.get('/community/categories')
}

/** 创建分类 */
export function createCategoryApi(data: { name: string; icon?: string; color?: string; description?: string; sort?: number }) {
  return request.post('/community/categories', data)
}

/** 更新分类 */
export function updateCategoryApi(id: number, data: { name?: string; icon?: string; color?: string; description?: string; sort?: number }) {
  return request.put(`/community/categories/${id}`, data)
}

/** 删除分类 */
export function deleteCategoryApi(id: number) {
  return request.delete(`/community/categories/${id}`)
}

/** 上传分类图标 */
export function uploadCategoryIconApi(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  return request.post('/community/categories/upload-icon', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

// ==================== 帖子管理 ====================

/** 获取帖子列表 */
export function getPostsApi(params: {
  page?: number
  pageSize?: number
  categoryId?: number
  keyword?: string
  sort?: string
  status?: string
}) {
  return request.get('/community/posts', { params })
}

/** 获取帖子详情 */
export function getPostDetailApi(id: number) {
  return request.get(`/community/posts/${id}`)
}

/** 创建帖子 */
export function createPostApi(data: { title: string; content: string; categoryId?: number }) {
  return request.post('/community/posts', data)
}

/** 更新帖子 */
export function updatePostApi(id: number, data: { title?: string; content?: string; categoryId?: number }) {
  return request.put(`/community/posts/${id}`, data)
}

/** 删除帖子 */
export function deletePostApi(id: number) {
  return request.delete(`/community/posts/${id}`)
}

/** 审核帖子 */
export function reviewPostApi(id: number, data: { status: string; rejectReason?: string }) {
  return request.put(`/community/posts/${id}/review`, data)
}

/** 获取帖子评论列表 */
export function getCommentsApi(postId: number) {
  return request.get(`/community/posts/${postId}/comments`)
}

/** 获取所有评论列表（管理员） */
export function getAllCommentsApi(params: { page?: number; pageSize?: number; keyword?: string }) {
  return request.get('/community/comments', { params })
}

/** 删除评论 */
export function deleteCommentApi(id: number) {
  return request.delete(`/community/comments/${id}`)
}
