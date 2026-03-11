import request from '@/utils/request'

/** 获取帖子列表 */
export function getPostsApi(params: {
  page?: number
  pageSize?: number
  category?: string
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
export function createPostApi(data: { title: string; content: string; category: string }) {
  return request.post('/community/posts', data)
}

/** 更新帖子 */
export function updatePostApi(id: number, data: { title?: string; content?: string; category?: string }) {
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
