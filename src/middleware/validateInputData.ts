import Ajv from 'ajv'
import { Context, Next } from 'koa'

export const validateInputData = (schema: string) => async (ctx: Context, next: Next) => {
  const ajv = new Ajv({ allErrors: true })
  const isValid = ajv.validate(require(schema), ctx.request.body)

  if (!isValid) {
    ctx.throw(422, ajv.errorsText())
  }
  await next()
}
