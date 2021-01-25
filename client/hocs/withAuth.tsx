import { GetServerSideProps } from "next";


export default function withAuth(WrappedComponent: any) {
  const ComponentWithWarnings = (props: any) => {

    const isAuth = true



    return (
      <WrappedComponent
        {...props}
        isAuth={isAuth}
      />
    );
  }
}

// withAuthServerSide.tsx

// import React from "react";

// export function withAuthServerSideProps(getServerSidePropsFunc?: Function) {
//   return async (context: any) => {
//     const user = await getUser(context);
//     if (getServerSidePropsFunc) {
//       return { props: { user, data: await getServerSidePropsFunc(context, user) } };
//     }
//     return { props: { user, data: { props: { user } } } };
//   }
// }

// async function getUser(content: any) {
//   return {
//     id: 1,
//     username: "JBis",
//     email: "test@test.com"
//   }
// }


// withAuthComponent.tsx
// export function withAuthComponent(Component: any) {
//   return ({ user, data }: { user: any, data: any }) => {
//     if (!user) {
//       return <h1>Denied</h1> // or redirect, we can use the Router because we are client side here
//     }
//     return <Component {...data.props} />
//   }
// }


// // protected.tsx

// import { withAuthComponent } from '../client/hoc/withAuthComponent';
// import { withAuthServerSideProps } from '../client/hoc/withAuthServerSide';


// function protectedPage({ user }: { user: any }) {
//   return <h1>Hello {user.username}</h1>
// }

// export default withAuthComponent(protectedPage)
// export const getServerSideProps = withAuthServerSideProps();