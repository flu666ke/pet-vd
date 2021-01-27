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

const useStyles = makeStyles((theme: Theme) => ({
  // root: {
  //   maxWidth: 600,
  //   width: '100%',
  //   margin: 0
  // },
}));

const ChatPage = observer(function ChatPage() {
  const classes = useStyles();

  const [isChatOpen, setIsChatOpen] = useState(false)

  const openChatWindow = () => {
    console.log(' open chat')
    setIsChatOpen(true)
  }
  return (
    <MainLayout title='Chat'>
      <Grid container>
        <Grid item sm={10}>
          {isChatOpen && <ChatWindow />}
        </Grid>
        <Grid item sm={2}>
          <Profiles openChatWindow={openChatWindow} />
        </Grid>
      </Grid>
    </MainLayout>
  )
})

export default ChatPage
export const getServerSideProps: GetServerSideProps = withAuthServerSideProps();
