import { Context, Next } from 'koa'

export const checkCookies = async (ctx: Context, next: Next) => {
  console.log(ctx.cookies.get('email'))

  await next()
}
