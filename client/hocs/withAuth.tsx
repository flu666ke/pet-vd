import { NextPage } from 'next'
import SignIn from '../pages/signin'

export function withAuth(Component: NextPage) {

  return (props: any) => {

    if (!props.hydrationData.user) {
      return <SignIn />
    }
    return <Component {...props} />
  }
}