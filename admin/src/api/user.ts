import request from '@/utils/request'

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
