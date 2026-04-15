import request from '@/utils/request'

export function getPostsApi(params?: Record<string, any>) {
  return request.get('/community/posts', { params })
}

export function getPostDetailApi(id: number) {
  return request.get(`/community/posts/${id}`)
}

export function createPostApi(data: Record<string, any>) {
  return request.post('/community/posts', data)
}

export function getCategoriesApi() {
  return request.get('/community/categories')
}

export function likePostApi(id: number) {
  return request.post(`/community/posts/${id}/like`)
}

export function favoritePostApi(id: number) {
  return request.post(`/community/posts/${id}/favorite`)
}

export function getPostCommentsApi(postId: number) {
  return request.get(`/community/posts/${postId}/comments`)
}

export function createCommentApi(postId: number, data: { content: string; parentId?: number }) {
  return request.post(`/community/posts/${postId}/comments`, data)
}

export function likeCommentApi(id: number) {
  return request.post(`/community/comments/${id}/like`)
}

export function getMyPostsApi(params?: Record<string, any>) {
  return request.get('/community/my/posts', { params })
}

export function getMyFavoritesApi(params?: Record<string, any>) {
  return request.get('/community/my/favorites', { params })
}

export function updatePostApi(id: number, data: Record<string, any>) {
  return request.put(`/community/posts/${id}`, data)
}

export function deletePostApi(id: number) {
  return request.delete(`/community/posts/${id}`)
}

export function uploadCommunityImageApi(formData: FormData) {
  return request.post('/community/posts/upload-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}
