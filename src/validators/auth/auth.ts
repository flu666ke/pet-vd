import Ajv from 'ajv'
import { Context, Next } from 'koa'

const ajv = new Ajv({ allErrors: true })

export const validateInputData = async (ctx: Context, next: Next) => {
  const isValid = ajv.validate(require('./schema.json'), ctx.request.body)

  if (!isValid) {
    ctx.throw(422, ajv.errorsText())
  }
  await next()
}
