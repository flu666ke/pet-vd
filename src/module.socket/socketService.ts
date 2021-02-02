import Koa from 'koa'
import http from 'http'

export default function socketService(app: Koa) {
  const server = http.createServer(app.callback())
  const io = require('socket.io')(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true
    }
  })

  io.on('connection', (socket: any) => {
    const response = new Date()
    socket.emit('FromAPI', response)
  })

  function sendMessage() {
    io.on('connection', (socket: any) => {
      return socket.on('sendMessage', (message: any) => {
        console.log({ message })
      })
    })
  }

  function getServer() {
    return server
  }

  return {
    getServer,
    sendMessage
  }
}

// private _afterListenHandlers: Array<Handler> = []

// constructor(app: ExpressRunnerModule) {
//   runner.afterListen(async () => {
//     const io = socketio(runner.server!, {
//       path: '/api/real-time'
//     })

//     this._processHandlers(this._afterListenHandlers, io)
//   })
// }

// afterListen(handler: Handler) {
//   this._afterListenHandlers.push(handler)
// }

// private async _processHandlers(handlers: Array<Handler>, io: socketio.Server) {
//   for (let handler of handlers) {
//     await handler(io)
//   }
// }
