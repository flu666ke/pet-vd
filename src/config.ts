export interface IConfig {
  port: number
  db: IDB
  salt: string
  activationEmailFrom: string
  activationEmailPassword: string
}

interface IDB {
  user: string
  port: number
  password: string
  database: string
}

export const config: IConfig = {
  port: (process.env.PORT && parseInt(process.env.PORT)) || 5000,
  db: {
    user: process.env.DB_USER || '',
    port: (process.env.DB_PORT && parseInt(process.env.DB_PORT)) || 8889,
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || ''
  },
  salt: process.env.SALT || '',
  activationEmailFrom: process.env.ACTIVATION_EMAIL_FROM || '',
  activationEmailPassword: process.env.ACTIVATION_EMAIL_PASSWORD || ''
}
