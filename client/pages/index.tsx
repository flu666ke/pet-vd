import { observer } from "mobx-react-lite";
import { GetServerSideProps } from "next";
import { useRouter } from 'next/router'
import { useEffect } from "react";
import { HomePage } from "../components/HomePage";
import { MainLayout } from '../components/MainLayout';
import { useErrorStore } from "../providers/RootStoreProvider";

const Index = observer(function Index() {

  const router = useRouter()
  const store = useErrorStore();

  useEffect(() => {
    if (store.error && store.error === 'Unauthorized') {
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

  let error = null
  let profile = null

  const cookie = ctx.req.headers.cookie
  console.log({ cookie })

  const response = await fetch(`http://localhost:5000`, { headers: { cookie: cookie! } })

  if (response.status === 200) {
    const { user } = await response.json()
    profile = {
      firstName: user.firstName,
      lastName: user.lastName
    }
  } else if (response.status === 401) {
    error = response.statusText
  }

  return {
    props: {
      hydrationData: {
        error: error,
        user: profile
      },
    },
  };
};