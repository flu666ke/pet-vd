import React, { ReactNode } from 'react';
import { observer } from 'mobx-react-lite';
import Head from 'next/head'

import Header from './Header';
import MessageSnackBar from './MessageSnackBar';
import { useErrorStore, useNoticeStore } from "../providers/RootStoreProvider";

interface MaiLayoutProps {
  title?: string
  children?: ReactNode
}

export const MainLayout = observer(function MainLayout({ children, title = 'VD' }: MaiLayoutProps) {

  const { error, clearError } = useErrorStore();
  const { notice, clearNotice } = useNoticeStore();

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta />
      </Head>
      <Header />
      {notice && <MessageSnackBar text={notice} type='success' onClear={clearNotice} />}
      {error && <MessageSnackBar text={error.message} type='error' onClear={clearError} />}
      <main>
        {children}
      </main>
    </>
  )
})