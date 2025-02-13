"use client"

import { useState, useEffect } from "react"
import { ChatList } from "@/components/chat-list"
import { ChatView } from "@/components/chat-view"
import { AuthForm } from "@/components/auth-form"
import { getContacts, getMessages, sendMessage, initializeSocket, getSocket } from "@/lib/api"
import type { Contact, Message } from "@/lib/types"

export default function ChatApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [messages, setMessages] = useState<Record<string, Message[]>>({})
  const [isMobileListVisible, setIsMobileListVisible] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      setIsAuthenticated(true)
      initializeSocket(token)
      fetchContacts()
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      const socket = getSocket()
      socket.on("receive_message", (message: Message) => {
        setMessages((prev) => ({
          ...prev,
          [message.senderId]: [...(prev[message.senderId] || []), message],
        }))
      })
      return () => {
        socket.off("receive_message")
      }
    }
  }, [isAuthenticated])

  const fetchContacts = async () => {
    try {
      const response = await getContacts()
      setContacts(response.data)
    } catch (error) {
      console.error("Error fetching contacts:", error)
    }
  }

  const handleAuthSuccess = () => {
    setIsAuthenticated(true)
    fetchContacts()
  }

  const handleSelectContact = async (contact: Contact) => {
    setSelectedContact(contact)
    setIsMobileListVisible(false)
    if (!messages[contact.id]) {
      try {
        const response = await getMessages(contact.id)
        setMessages((prev) => ({ ...prev, [contact.id]: response.data }))
      } catch (error) {
        console.error("Error fetching messages:", error)
      }
    }
  }

  const handleBackToList = () => {
    setIsMobileListVisible(true)
  }

  const handleSendMessage = async (content: string) => {
    if (!selectedContact) return

    try {
      const response = await sendMessage(selectedContact.id, content)
      const newMessage = response.data
      setMessages((prev) => ({
        ...prev,
        [selectedContact.id]: [...(prev[selectedContact.id] || []), newMessage],
      }))
      getSocket().emit("send_message", newMessage)
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="relative z-10 w-full max-w-md px-6 py-12 bg-gray-800 bg-opacity-80 backdrop-blur-sm rounded-2xl shadow-xl">
          <AuthForm onAuthSuccess={handleAuthSuccess} />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col md:flex-row h-screen w-full">
      <div className={`${isMobileListVisible ? "block" : "hidden"} md:block md:w-1/3 lg:w-1/4 xl:w-1/5 h-full`}>
        <ChatList contacts={contacts} onSelectContact={handleSelectContact} selectedContactId={selectedContact?.id} />
      </div>
      <div className={`${isMobileListVisible ? "hidden" : "block"} md:block md:w-2/3 lg:w-3/4 xl:w-4/5 h-full`}>
        {selectedContact ? (
          <ChatView
            contact={selectedContact}
            messages={messages[selectedContact.id] || []}
            onSendMessage={handleSendMessage}
            onBackToList={handleBackToList}
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-900 text-white">
            <p>Select a contact to start chatting</p>
          </div>
        )}
      </div>
    </div>
  )
}

