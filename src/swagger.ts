import Router from 'koa-router' //引入路由函数
import swaggerJsdoc from 'swagger-jsdoc'

const router = new Router()

const swaggerDefinition = {
  info: {
    title: 'API',
    version: '1.0.0',
    description: 'API'
  },
  host: 'localhost:3000',
  basePath: '/' // Base path (optional)
}

const options = {
  swaggerDefinition,
  apis: ['./routes/**/*.ts']
}

const swaggerSpec = swaggerJsdoc(options)

router.get('/swagger.json', async function (ctx: any) {
  ctx.set('Content-Type', 'application/json')
  ctx.body = swaggerSpec
})

export default router
