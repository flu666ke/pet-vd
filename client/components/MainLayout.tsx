import { observer } from 'mobx-react-lite';
import Head from 'next/head'
import React, { useEffect, useState } from 'react';
import AuthHeader from './AuthHeader';
import MessageSnackBar from './MessageSnackBar';
import { useErrorStore } from "../providers/RootStoreProvider";

const headerMenuLinks = [
  {
    to: '/',
    text: 'home'
  },
  {
    to: '/signin',
    text: 'login'
  },
  {
    to: '/signup',
    text: 'register'
  }
];

export const MainLayout = observer(function MainLayout({ children, title = 'VD', message = '' }: any) {

  const store = useErrorStore();

  console.log({ store })

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta />
        <meta />
        <meta />
      </Head>

      <AuthHeader menuLinks={headerMenuLinks} />
      {/* <nav>NAVIGATION</nav> */}

      {message && <MessageSnackBar text={message} type='success' onClear={store.clearMessage} />}
      {store.error && <MessageSnackBar text={store.error} type='error' onClear={store.clearMessage} />}
      <main>
        {children}
      </main>
    </>
  )
})