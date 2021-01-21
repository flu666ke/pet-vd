import React, { ReactNode } from 'react';
import { observer } from 'mobx-react-lite';
import Head from 'next/head'

import AuthHeader from './AuthHeader';
import MessageSnackBar from './MessageSnackBar';
import { useErrorStore, useNoticeStore } from "../providers/RootStoreProvider";

interface MaiLayoutProps {
  title?: string
  children?: ReactNode
}

export const MainLayout = observer(function MainLayout({ children, title = 'VD' }: MaiLayoutProps) {

  const errorStore = useErrorStore();
  const noticeStore = useNoticeStore();

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta />
      </Head>
      <AuthHeader />
      {noticeStore.notice && <MessageSnackBar text={noticeStore.notice} type='success' onClear={noticeStore.clearNotice} />}
      {errorStore.error && <MessageSnackBar text={errorStore.error} type='error' onClear={errorStore.clearError} />}
      <main>
        {children}
      </main>
    </>
  )
})