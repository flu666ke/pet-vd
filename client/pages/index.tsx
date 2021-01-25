import { GetServerSideProps } from "next";

import { HomePage } from "../components/HomePage";
import { MainLayout } from '../components/MainLayout';
import { withAuthServerSideProps } from "../hocs/withAuthServerSideProps";

const Index = () => {
  return <MainLayout title='Home Page'>
    <HomePage />
  </MainLayout>
}

export default Index
export const getServerSideProps: GetServerSideProps = withAuthServerSideProps();

