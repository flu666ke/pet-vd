import Koa from 'koa'
import http from 'http'
import { Socket } from 'socket.io'
import { IConfig } from 'src/config'

export default function socketService(app: Koa, config: IConfig) {
  const server = http.createServer(app.callback())
  const io = require('socket.io')(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true
    }
  })

  server
    .listen(config.port, async () => {
      console.log(`Server listening on port: ${config.port}`)
    })
    .on('error', (err: any) => {
      console.error(err)
    })

  io.on('connection', function (socket: Socket) {
    socket.on('initRoom', function ({ room }: { room: string }) {
      console.log('initRoom --- ', room)
      socket.join(room)
    })

    socket.on('inputMessage', function (data: any) {
      console.log('inputMessage --- ', data)
      io.in(data.room).emit('outputMessage', data)
    })

    socket.on('exitRoom', function ({ room }: { room: string }) {
      console.log('exitRoom --- ', room)
      socket.leave(room)
    })
  })

  return {
    // sendMessage,
    // handleSocket
  }
}
