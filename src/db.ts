import mysql from 'mysql'

class DB {
  private static _instance: DB

  cnn: mysql.Connection
  connected: boolean = false

  constructor() {
    console.log('Class initialized')

    this.cnn = mysql.createConnection({
      // host: '127.0.0.1',
      host: 'localhost',
      user: 'root',
      port: 8889,
      password: 'root',
      database: 'vd',
      charset: 'utf8mb4'
    })

    this.connectDB()
  }

  public static get instance() {
    return this._instance || (this._instance = new this())
  }

  static async runQuery(query: string): Promise<unknown | any> {
    return new Promise((resolve, reject) => {
      this.instance.cnn.query(query, (err: any, results: Object[], fields: any) => {
        if (err) {
          console.log('Error query', err)
          reject(err)
        }

        if (results.length === 0) {
          // resolve('The requested  record does not exist')
          resolve(null)
        } else {
          resolve(results)
        }
      })
    })
  }

  private connectDB() {
    this.cnn.connect((err: mysql.MysqlError) => {
      if (err) {
        console.error('error connecting: ' + err.message)
        return
      }

      this.connected = true
      console.log('Online Database')

      DB.runQuery(
        'CREATE TABLE IF NOT EXISTS `users`(`id` int AUTO_INCREMENT, `email` VARCHAR(255), `password` VARCHAR(60), PRIMARY KEY(id), `emailVerifiedAt` DATETIME)'
      )
      DB.runQuery(
        'CREATE TABLE IF NOT EXISTS `profiles`(`userId` INT(10), `firstName` VARCHAR(60), `lastName` VARCHAR(60), `gender` VARCHAR(60), `updatedAt` TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(), `createdAt` TIMESTAMP NOT NULL DEFAULT NOW(), FOREIGN KEY (userId) REFERENCES `users` (id) ON DELETE CASCADE)'
      )
      DB.runQuery(
        'CREATE TABLE IF NOT EXISTS `activations`(`userId` INT(10), `activationId` VARCHAR(60), `expiresAt` DATETIME, FOREIGN KEY (userId) REFERENCES `users` (id) ON DELETE CASCADE)'
      )
      DB.runQuery(
        'CREATE TABLE IF NOT EXISTS `accessTokens`(`userId` INT(10), `accessToken` VARCHAR(60), `expiresAt` DATETIME, FOREIGN KEY (userId) REFERENCES `users` (id) ON DELETE CASCADE)'
      )
      DB.runQuery(
        'CREATE TABLE IF NOT EXISTS `restorePasswords`(`userId` INT(10), `restorePasswordId` VARCHAR(60), `expiresAt` DATETIME, FOREIGN KEY (userId) REFERENCES `users` (id) ON DELETE CASCADE)'
      )
      DB.runQuery(
        'CREATE TABLE IF NOT EXISTS `chats`(`id` int AUTO_INCREMENT, `oneToOneKey` VARCHAR(60),`lastMessageSentAt` DATETIME, PRIMARY KEY(id))'
      )
      DB.runQuery(
        'CREATE TABLE IF NOT EXISTS `messages`(`id` int AUTO_INCREMENT, `uuid` VARCHAR(60), `chatId` INT(10), `senderId` INT(10), `text` VARCHAR(255), `sentAt` DATETIME, PRIMARY KEY(id), FOREIGN KEY (chatId) REFERENCES `chats` (id) ON DELETE CASCADE, FOREIGN KEY (senderId) REFERENCES `users` (id) ON DELETE CASCADE)'
      )
      DB.runQuery(
        'CREATE TABLE IF NOT EXISTS `chatParticipants`(`id` int AUTO_INCREMENT, `chatId` INT(10), `userId` INT(10), PRIMARY KEY(id), FOREIGN KEY (chatId) REFERENCES `chats` (id) ON DELETE CASCADE, FOREIGN KEY (userId) REFERENCES `users` (id) ON DELETE CASCADE)'
      )
    })
  }
}

export default DB

export type DataBase = typeof DB
