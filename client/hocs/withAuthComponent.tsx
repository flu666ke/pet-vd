export function withAuthComponent(Component: any) {
  return ({ user, data }: { user: any, data: any }) => {
    if (!user) {
      return <h1>Denied</h1> // or redirect, we can use the Router because we are client side here
    }
    return <Component {...data.props} />
  }
}