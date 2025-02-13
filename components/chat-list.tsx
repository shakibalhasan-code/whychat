"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Contact } from "@/lib/types"

interface ChatListProps {
  contacts: Contact[]
  onSelectContact: (contact: Contact) => void
  selectedContactId?: string
}

export function ChatList({ contacts, onSelectContact, selectedContactId }: ChatListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("friends")

  const filteredContacts = contacts.filter((contact) => contact.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="flex items-center justify-between p-4">
        <h1 className="text-white text-lg font-medium">Contacts ({contacts.length})</h1>
        <div className="relative w-full max-w-xs">
          <Input
            type="search"
            placeholder="Search..."
            className="w-full bg-gray-800 text-white border-gray-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="px-2">
        <TabsList className="bg-gray-800/50 w-full">
          <TabsTrigger value="friends" className="text-white flex-1">
            Friends
          </TabsTrigger>
          <TabsTrigger value="groups" className="text-white flex-1">
            Groups
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="overflow-y-auto flex-grow px-2 py-4">
        {filteredContacts.map((contact) => (
          <button
            key={contact.id}
            className={`flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-800/50 w-full text-left mb-2 ${
              selectedContactId === contact.id ? "bg-gray-800/50" : ""
            }`}
            onClick={() => onSelectContact(contact)}
          >
            <div className="relative flex-shrink-0">
              <Avatar>
                <AvatarImage src={contact.avatar} />
                <AvatarFallback>{contact.name[0]}</AvatarFallback>
              </Avatar>
              {contact.isOnline && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium">{contact.name}</p>
              <p className="text-gray-400 text-sm truncate">{contact.lastMessage}</p>
            </div>
            {contact.unreadCount > 0 && (
              <span className="bg-purple-500 text-white text-xs rounded-full px-2 py-0.5">{contact.unreadCount}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

