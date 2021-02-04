import Koa from 'koa'
import http from 'http'
import { Socket } from 'socket.io'
import { IConfig } from 'src/config'
import { DataBase } from 'src/db'

export default function socketService(app: Koa, config: IConfig) {
  const DB: DataBase = app.context.db
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

    socket.on('inputMessage', async function ({ room, message }: { room: string; message: any }) {
      const selectMessage = `SELECT * FROM messages WHERE uuid = '${message.uuid}'`
      const selectedMessage = await DB.runQuery(selectMessage)

      if (selectedMessage) {
        delete message.chatId
        delete message.uuid
        delete message.isMessageSubmitting
        message.sentAt = selectedMessage[0].sentAt
        message.id = selectedMessage[0].id
      } else {
        return
      }

      console.log('inputMessage --- ', message)
      io.in(room).emit('outputMessage', message)
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
