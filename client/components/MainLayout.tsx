import Head from 'next/head'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import AuthHeader from './AuthHeader';
import API from '../services/api';
import MessageSnackBar from './MessageSnackBar';

const headerMenuLinks = [
  {
    to: '/home',
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

export function MainLayout({ children, title = 'VD', message, errors }: any) {
  const router = useRouter()

  const [loading, setLoading] = useState(false)

  // useEffect(() => {

  //   const load = async () => {

  //     try {
  //       setLoading(true)
  //       const response = await API.getHomePage()
  //       console.log({ response })
  //       if (response && response.user) {
  //         router.push('/')
  //       }

  //     } catch (error) {
  //       console.log(error)

  //       router.push('/signin')

  //     } finally {
  //       setLoading(false)
  //     }


  //   }

  //   load()

  // }, []);


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

      {message && <MessageSnackBar text={message} type='success' />}
      {errors && <MessageSnackBar text={errors} type='error' />}
      <main>
        {children}
      </main>
    </>
  )
}