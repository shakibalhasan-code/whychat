import axios from "axios"
import { io, type Socket } from "socket.io-client"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export const api = axios.create({
  baseURL: API_URL,
})

let socket: Socket

export const setAuthToken = (token: string) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`
    localStorage.setItem("token", token)
  } else {
    delete api.defaults.headers.common["Authorization"]
    localStorage.removeItem("token")
  }
}

export const initializeSocket = (token: string) => {
  socket = io(process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5000", {
    auth: { token },
  })
  return socket
}

export const getSocket = () => socket

// Auth API calls
export const register = (name: string, email: string, password: string) =>
  api.post("/auth/register", { name, email, password })

export const login = (email: string, password: string) => api.post("/auth/login", { email, password })

// User API calls
export const getContacts = () => api.get("/users/contacts")
export const addContact = (email: string) => api.post("/users/contacts", { email })

// Message API calls
export const getMessages = (contactId: string) => api.get(`/messages/${contactId}`)
export const sendMessage = (receiverId: string, content: string) => api.post("/messages", { receiverId, content })

