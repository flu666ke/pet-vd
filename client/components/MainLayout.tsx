import Head from 'next/head'
import React from 'react';
import AuthHeader from './AuthHeader';

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

export function MainLayout({ children, title = 'VD' }: any) {
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
      <main>
        {children}
      </main>
    </>
  )
}