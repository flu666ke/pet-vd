import { GetServerSideProps } from "next";
import { useEffect } from 'react'
import HomePage from "../components/HomePage";
import { MainLayout } from '../components/MainLayout';
import API from "../services/api";

export default function Index() {


  useEffect(() => {
    const load = async () => {
      const response = await API.getHomePage()
      console.log({ response })
    }
    load()
  }, [])

  return <MainLayout title='Home Page'>
    <HomePage />
  </MainLayout>
}

export const getServerSideProps: GetServerSideProps = async function getServerSideProps(
  ctx
) {
  // let start = 0;

  // console.log({ ctx })
  // const cookies = ctx.req.headers.cookie

  // console.log({ cookies })
  // if (ctx.query.start && typeof ctx.query.start === "string") {
  //   start = Number(ctx.query.start);
  // }

  // const response = await fetch(`http://localhost:5000`)

  return {
    props: {
      hydrationData: {
        // error: response.statusText
        error: ''
      },
    },
  };
};