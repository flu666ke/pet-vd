import {
  makeStyles,
  Grid,
  Theme,
} from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import { GetServerSideProps } from 'next';
import React, { ChangeEvent, useState } from 'react';

import ChatWindow from "../../components/Chat/ChatWindow";
import Profiles from "../../components/Chat/Profiles";
import { MainLayout } from "../../components/MainLayout";
import { withAuthServerSideProps } from '../../hocs/withAuthServerSideProps';
import { useProfileStore } from '../../providers/RootStoreProvider';
import API from '../../services/api';

const useStyles = makeStyles((theme: Theme) => ({
  // root: {
  //   maxWidth: 600,
  //   width: '100%',
  //   margin: 0
  // },
  loader: {
    height: 'calc(100vh - 64px)',
    background: theme.palette.background.default,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
}));

interface MessageState {
  chatId?: number | null
  senderId: number | null
  text: string
  sentAt?: Date
}

const ChatPage = observer(function ChatPage() {
  const classes = useStyles();

  const { profiles, profile } = useProfileStore();

  const chatId = null
  const [isLoading, setLoading] = useState(false)
  const [message, setMessage] = useState<MessageState>({
    chatId: chatId ? chatId : null,
    senderId: profile ? profile!.userId : null,
    text: ''
  });

  const [chat, setChat] = useState([])

  const [isChatOpen, setIsChatOpen] = useState(false)

  const onTextChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setMessage({ ...message, [e.target.name]: e.target.value });
  };

  const submitMessage = async (e: React.MouseEvent<HTMLButtonElement>) => {
    message.sentAt = new Date()
    await API.sendMessage(message)

    setMessage({ ...message, text: '' });
  };

  const openChatWindow = async (recipientId: number) => {

    setMessage({ ...message });

    if (!isChatOpen) {
      try {
        setLoading(true)
        setIsChatOpen(true)
        const { chat } = await API.createChat({ userIds: [profile!.userId, recipientId] })

        setMessage({ ...message, chatId: chat.chatId })

        setChat(chat.messages)
      } catch (error) {
        console.log({ error })
      } finally {
        setLoading(false)
      }
    } else {
      setIsChatOpen(false)
    }
  }

  const closeChatWindow = () => {
    setIsChatOpen(false)
  }

  return (
    <MainLayout title='Chat'>
      <Grid container>
        <Grid item sm={10}>
          {isChatOpen && <ChatWindow
            closeChatWindow={closeChatWindow}
            onTextChange={onTextChange}
            submitMessage={submitMessage}
            text={message.text}
            isLoading={isLoading}
            chat={chat}
          />}
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
