import fs from 'fs'
import path from 'path'
import Koa, { Context } from 'koa'
import Router from 'koa-router' //引入路由函数
import { koaSwagger } from 'koa2-swagger-ui'

export interface DocsConfig {
  title: string
  description: string
  version: string
}

export type SwaggerDocument = { [key: string]: any }
export interface ComposeHook {
  (document: SwaggerDocument): void
}

function composeDocs(document: SwaggerDocument, directory: string) {
  const files = fs.readdirSync(directory)

  files.forEach(function (file) {
    if (fs.statSync(directory + '/' + file).isDirectory()) {
      if (!document[file]) {
        document[file] = {}
      }
      composeDocs(document[file], directory + '/' + file)
    } else if (file.endsWith('.json')) {
      const key = path.basename(file, '.json')
      const json = JSON.parse(fs.readFileSync(directory + '/' + file, 'utf8'))
      if (Array.isArray(json)) {
        if (!document[key]) {
          document[key] = []
        }
        document[key] = document[key].concat(json)
      } else {
        if (!document[key]) {
          document[key] = {}
        }
        Object.assign(document[key], json)
      }
    }
  })
}

export default function docsService(app: Koa) {
  const compose: Array<ComposeHook> = []
  const router = new Router()

  async function createSwaggerDocs() {
    const swaggerDocument = {
      openapi: '3.0.2',
      info: {
        title: 'API',
        version: '3.0.2',
        description: 'API'
      },
      host: 'localhost:5000',
      basePath: '/',
      tags: [
        {
          name: 'VD',
          description: 'API for creating VD'
        }
      ]
    }

    compose.forEach(hook => hook(swaggerDocument))

    router.get('/swagger.json', async function (ctx: Context) {
      ctx.set('Content-Type', 'application/json')
      ctx.body = swaggerDocument
    })

    app.use(
      koaSwagger({
        routePrefix: '/swagger',
        swaggerOptions: {
          url: '/swagger.json'
        }
      })
    )
    app.use(router.routes())
  }

  return {
    createSwaggerDocs,
    compose: (hook: ComposeHook) => {
      compose.push(hook)
    },
    composeWithDirectory: (directory: string, basePath?: string) => {
      compose.push((document: SwaggerDocument) => {
        if (basePath) {
          const basePathArray = basePath.split('/').filter(p => p.length > 0)
          document = basePathArray.reduce((d, p) => (d[p] ? d[p] : Object.assign(d, { [p]: {} })[p]), document)
        }
        composeDocs(document, directory)
      })
    }
  }
}

export type DocsService = ReturnType<typeof docsService>
