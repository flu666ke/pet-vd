import socketIOClient from 'socket.io-client'

const socket = socketIOClient.io('http://localhost:5000', {
  withCredentials: true,
  extraHeaders: {
    'Content-Type': 'application/json'
  }
})

export default socket
