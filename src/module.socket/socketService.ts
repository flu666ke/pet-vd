import Koa from 'koa'
import http from 'http'
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

  io.on('connection', function (socket: any) {
    socket.on('initRoom', function (data: any) {
      console.log('initRoom --- ', data.room)
      socket.join(data.room)
    })

    socket.on('inputMessage', function (data: any) {
      console.log('inputMessage --- ', data)
      io.in(data.room).emit('outputMessage', data)
    })

    socket.on('exitRoom', function (data: any) {
      console.log('exitRoom --- ', data.room)
      socket.leave(data.room)
    })
  })

  return {
    // sendMessage,
    // handleSocket
  }
}
