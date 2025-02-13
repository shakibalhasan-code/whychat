export interface Message {
  id: string
  content: string
  senderId: string
  receiverId: string
  timestamp: Date
  isRead: boolean
}

export interface Contact {
  id: string
  name: string
  avatar: string
  lastMessage?: string
  lastMessageTime?: string
  isOnline: boolean
  unreadCount: number
}

