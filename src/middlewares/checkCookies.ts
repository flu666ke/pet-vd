import { Context, Next } from 'koa'

export const checkCookies = async (ctx: Context, next: Next) => {
  try {
    const accessToken = ctx.cookies.get('accessToken')

    console.log({ accessToken })

    if (accessToken) {
      await next()
    } else {
      ctx.throw(401, 'no cookies')
    }
  } catch (err) {
    ctx.status = err.status || 500
    ctx.body = err.message
  }
}

// export const checkCookies = async (ctx: Context, next: Next) => {
//   try {
//     const email = ctx.cookies.get('email')

//     if (email) {
//       const selectUser = `SELECT email, emailVerifiedAt FROM users WHERE email = '${email}'`
//       const user = await ctx.app.context.db.runQuery(selectUser)
//       console.log({ user })

//       if (user.length && user[0].emailVerifiedAt) {
//         await next()
//       } else {
//         ctx.throw(401, 'User with email does not exist or have not verified yet')
//       }
//     } else {
//       ctx.throw(401, 'no cookies')
//     }
//   } catch (err) {
//     ctx.status = err.status || 500
//     ctx.body = err.message
//   }
// }
