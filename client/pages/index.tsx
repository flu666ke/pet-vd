import { observer } from "mobx-react-lite";
import { GetServerSideProps } from "next";
import { useRouter } from 'next/router'
import { useEffect } from "react";
import { HomePage } from "../components/HomePage";
import { MainLayout } from '../components/MainLayout';
import { useErrorStore } from "../providers/RootStoreProvider";

const Index = observer(function Index(props: any) {

  console.log('index props --- ', props)

  const router = useRouter()
  const { error } = useErrorStore();

  useEffect(() => {
    if (error && error.message === 'Unauthorized') {
      router.push('/signin')
    }
  }, [])

  return <MainLayout title='Home Page'>
    <HomePage />
  </MainLayout>
})

export default Index

export const getServerSideProps: GetServerSideProps = async function getServerSideProps(
  ctx
) {

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
};