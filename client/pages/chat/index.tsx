import Profiles from "../../components/Chat/Profiles";
import { MainLayout } from "../../components/MainLayout";

export default function ChatPage() {
  return <MainLayout title='Chat'>
    <h1>Chat</h1>
    <Profiles />
  </MainLayout>
}
