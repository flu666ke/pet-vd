import React from "react";

export function withAuthServerSideProps(getServerSidePropsFunc?: Function) {
  return async (context: any) => {
    const user = await getUser(context);
    if (getServerSidePropsFunc) {
      return { props: { user, data: await getServerSidePropsFunc(context, user) } };
    }
    return { props: { user, data: { props: { user } } } };
  }
}

async function getUser(ctx: any) {
  let errors = null
  let profile = null

  const cookie = ctx.req.headers.cookie
  console.log({ cookie })

  const response = await fetch(`http://localhost:5000`, { headers: { cookie: cookie! } })

  if (response.status === 200) {
    const { user } = await response.json()
    profile = user
  } else if (response.status === 401) {
    const { error } = await response.json()

    console.log({ error })
    errors = response.statusText
  }

  return {
    props: {
      hydrationData: {
        error: errors,
        user: profile
      },
    },
  };
}