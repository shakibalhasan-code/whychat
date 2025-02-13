"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Phone, MoreVertical, Paperclip, Mic, Send, ArrowLeft } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Contact, Message } from "@/lib/types"
import { formatMessageTime } from "@/lib/utils"

interface ChatViewProps {
  contact: Contact
  messages: Message[]
  onSendMessage: (content: string) => void
  onBackToList: () => void
}

export function ChatView({ contact, messages, onSendMessage, onBackToList }: ChatViewProps) {
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [scrollToBottom])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim()) {
      onSendMessage(newMessage)
      setNewMessage("")
    }
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-800 to-gray-900">
      <div className="flex items-center p-4 border-b border-gray-700">
        <Button variant="ghost" size="icon" className="md:hidden mr-2 text-white" onClick={onBackToList}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Avatar className="h-10 w-10">
          <AvatarImage src={contact.avatar} />
          <AvatarFallback>{contact.name[0]}</AvatarFallback>
        </Avatar>
        <div className="ml-3 flex-1">
          <p className="text-white text-lg">{contact.name}</p>
          <p className="text-gray-400 text-sm">{contact.isOnline ? "Online" : "Offline"}</p>
        </div>
        <Button variant="ghost" size="icon" className="text-white">
          <Phone className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-white">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.senderId === "me" ? "justify-end" : "justify-start"}`}>
            <div
              className={`rounded-2xl py-2 px-4 max-w-[75%] break-words ${
                message.senderId === "me" ? "bg-purple-500 text-white" : "bg-gray-700 text-white"
              }`}
            >
              {message.content}
              <div className={`text-xs mt-1 ${message.senderId === "me" ? "text-purple-200" : "text-gray-400"}`}>
                {formatMessageTime(new Date(message.timestamp))}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700">
        <div className="flex items-center space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message"
            className="flex-1 bg-gray-800 border-gray-700 text-white"
          />
          <Button type="button" variant="ghost" size="icon" className="text-gray-400">
            <Paperclip className="h-5 w-5" />
          </Button>
          <Button type="button" variant="ghost" size="icon" className="text-gray-400">
            <Mic className="h-5 w-5" />
          </Button>
          <Button type="submit" size="icon" className="bg-blue-500 hover:bg-blue-600">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </form>
    </div>
  )
}

