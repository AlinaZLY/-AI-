import request from '@/utils/request'

export function getConversationsApi() {
  return request.get('/chat/conversations')
}

export function startConversationApi(data: { targetUserId: number; jobId?: number; content: string }) {
  return request.post('/chat/conversations', data)
}

export function getMessagesApi(conversationId: number, page = 1, pageSize = 50) {
  return request.get('/chat/messages', { params: { conversationId, page, pageSize } })
}

export function sendMessageApi(data: { conversationId: number; content: string }) {
  return request.post('/chat/messages', data)
}

export function getChatUnreadApi() {
  return request.get('/chat/unread')
}
