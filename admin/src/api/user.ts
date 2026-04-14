import request from '@/utils/request'

export function getUsersAdminApi(params?: Record<string, any>) {
  return request.get('/user/admin/list', { params })
}

export function toggleUserActiveApi(id: number) {
  return request.put(`/user/admin/${id}/toggle-active`)
}

export function createUserAdminApi(data: Record<string, any>) {
  return request.post('/user/admin/create', data)
}

export function updateUserAdminApi(id: number, data: Record<string, any>) {
  return request.put(`/user/admin/${id}`, data)
}

export function deleteUserAdminApi(id: number) {
  return request.delete(`/user/admin/${id}`)
}

/** 更新个人资料 */
export function updateProfileApi(data: Record<string, string>) {
  return request.put('/user/profile', data)
}

/** 修改密码 */
export function changePasswordApi(data: { oldPassword: string; newPassword: string }) {
  return request.put('/user/password', data)
}

/** 上传头像 */
export function uploadAvatarApi(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  return request.post('/user/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}
