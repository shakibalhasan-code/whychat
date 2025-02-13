import axios from "axios"
import io from "socket.io-client"

const API_URL = "http://localhost:5000/api"

export const api = axios.create({
  baseURL: API_URL,
})

export const setAuthToken = (token: string) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common["Authorization"]
  }
}

export const socket = io("http://localhost:5000", {
  autoConnect: false,
})

export const connectSocket = (token: string) => {
  socket.auth = { token }
  socket.connect()
}

export const disconnectSocket = () => {
  socket.disconnect()
}

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

