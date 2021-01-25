export function withAuthServerSideProps(getServerSidePropsFunc?: Function) {
  return async (ctx: any) => {
    const { props } = await getUser(ctx);

    if (getServerSidePropsFunc) {
      return { props: { data: await getServerSidePropsFunc(ctx) } };
    }
    return { props };
  }
}

async function getUser(ctx: any) {
  let responseError = null
  let profile = null

  const cookie = ctx.req.headers.cookie

  const response = await fetch(`http://localhost:5000`, { headers: { cookie: cookie! } })

  if (response.status === 200) {
    const { user } = await response.json()
    profile = user
  } else if (response.status === 401) {
    const { error } = await response.json()

    responseError = response.statusText
  }

  return {
    props: {
      hydrationData: {
        error: responseError ? { message: responseError, httpStatus: response.status, code: 'some code' } : responseError,
        user: profile
      },
    },
  };
}