import {
  makeStyles,
  Grid,
  Theme
} from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import { GetServerSideProps } from 'next';
import { useState } from 'react';

import ChatWindow from "../../components/Chat/ChatWindow";
import Profiles from "../../components/Chat/Profiles";
import { MainLayout } from "../../components/MainLayout";
import { withAuthServerSideProps } from '../../hocs/withAuthServerSideProps';
import { useProfileStore } from '../../providers/RootStoreProvider';

const useStyles = makeStyles((theme: Theme) => ({
  // root: {
  //   maxWidth: 600,
  //   width: '100%',
  //   margin: 0
  // },
}));

const ChatPage = observer(function ChatPage() {
  const classes = useStyles();

  const { profiles, profile } = useProfileStore();

  const [isChatOpen, setIsChatOpen] = useState(false)

  // useEffect(() => {

  //   const getProfiles = async () => {
  //     try {
  //       const response = await API.getProfiles()

  //       console.log({ response })
  //       // setNotice(response.message)
  //       // router.push('/')
  //     } catch (error) {
  //       console.log({ error })
  //       // setError(error.response.data.error)
  //       // router.push('/signin')
  //     }
  //   }
  //   getProfiles()

  // }, []);

  const openChatWindow = () => {
    setIsChatOpen(true)
  }

  const closeChatWindow = () => {
    setIsChatOpen(false)
  }

  return (
    <MainLayout title='Chat'>
      <Grid container>
        <Grid item sm={10}>
          {isChatOpen && <ChatWindow closeChatWindow={closeChatWindow} profile={profile!} />}
        </Grid>
        <Grid item sm={2}>
          <Profiles openChatWindow={openChatWindow} profiles={profiles ? profiles : []} />
        </Grid>
      </Grid>
    </MainLayout>
  )
})

const getProfiles = async (ctx: any) => {
  const cookie = ctx.req.headers.cookie
  const response = await fetch(`http://localhost:5000/profiles`, { headers: { cookie: cookie! } })
  const { profiles } = await response.json()

  return { profiles }
}

export default ChatPage
export const getServerSideProps: GetServerSideProps = withAuthServerSideProps(getProfiles);
