import request from '@/utils/request'

export function getProfileApi() {
  return request.get('/user/profile')
}

export function updateProfileApi(data: Record<string, any>) {
  return request.put('/user/profile', data)
}

export function uploadAvatarApi(formData: FormData) {
  return request.post('/user/avatar', formData)
}

export function changePasswordApi(data: { oldPassword: string; newPassword: string }) {
  return request.put('/user/password', data)
}
