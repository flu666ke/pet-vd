import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router'
import { CircularProgress, Grid, IconButton, makeStyles, TextField, Theme } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { observer } from 'mobx-react-lite';
import { v4 as uuidv4 } from 'uuid'

import { MainLayout } from '../../components/MainLayout';
import Button from '../../components/common/Button';
import { withAuthServerSideProps } from '../../hocs/withAuthServerSideProps';
import { useChatStore, useProfileStore } from '../../providers/RootStoreProvider';
import API from '../../services/api';
import socket from '../../services/socketio';
import Message from '../../components/Chat/Message';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: 500,
    margin: 40,
    backgroundColor: theme.palette.background.default,
  },
  chatWindow: {
    position: 'relative',
    height: 400,
    backgroundColor: theme.palette.secondary.main,
    border: `2px solid ${theme.palette.primary.main}`,
    borderRadius: 6,
    margin: '40px auto',
    boxShadow: "inset 0 0 12px 0 rgba(0, 0, 0, 0.5)",
  },
  notchedOutline: {
    borderWidth: 2
  },
  scroll: {
    // ...theme.typography.subtitle1,
    // color: theme.palette.primary.light,
    marginTop: 0,
    // marginBottom: 30,
    paddingLeft: 0,
    overflow: "auto",
    // overflowX: "hidden",
    maxHeight: 396,
    "&::-webkit-scrollbar": {
      width: 7,
      cursor: 'pointer'
    },
    "&::-webkit-scrollbar-track": {
      boxShadow: "inset 0 0 6px rgba(0,0,0,0.3)",
      backgroundColor: theme.palette.secondary.main,
      borderRadius: 6,
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: theme.palette.primary.main,
      borderRadius: 6,
    },
  },
  input: {
    width: '96%',
    '& .MuiInputBase-input': {
      color: theme.palette.primary.light
    }
  },
  closeButton: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.light,
    position: 'absolute',
    top: -15,
    left: -15,
    "&:hover": {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.primary.main,
    },
  },
  loader: {
    height: 'calc(80vh - 64px)',
    background: theme.palette.background.default,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
}));

interface MessageState {
  chatId?: number | null
  senderId: number | null
  sender: string
  text: string
  sentAt?: Date
  uuid: string
}

interface ChatMessage {
  id?: number
  senderId?: number
  sender: string
  text: string
  sentAt?: Date
  isMessageSubmitting?: boolean
}

const ChatWindow = observer(function ChatWindow() {
  const classes = useStyles();
  const router = useRouter()

  const { profile } = useProfileStore();
  const { setChatToStore, chat } = useChatStore();

  const [isLoading, setLoading] = useState<boolean>(false)
  const [isMessageSubmitting, setIsMessageSubmitting] = useState<boolean>(false)

  const [message, setMessage] = useState<MessageState>({
    chatId: null,
    senderId: profile ? profile!.userId : null,
    sender: profile ? profile.firstName : '',
    text: '',
    uuid: uuidv4()
  });

  useEffect(() => {
    if (router.query.id) {
      const getChat = async () => {
        try {
          setLoading(true)
          const { chat } = await API.createChat({ oneToOneKey: router.query.id })
          setChatToStore(chat)

          socket.emit('initRoom', { room: chat.chatId });

        } catch (error) {
          console.log(error)
        } finally {
          setLoading(false)
        }
      }
      getChat()
    }
    return () => { socket.emit('exitRoom', { room: chat?.chatId }) }
  }, [router.query.id]);

  useEffect(() => {
    setMessage({ ...message, chatId: chat ? chat.chatId : null });

    socket.on("outputMessage", ({ message }: any) => {
      console.log('outputMessage --- ', message)
      // setChatToStore({ ...chat, messages: [...chat!.messages, Object.assign(message, { isMessageSubmitting: true })] })
    });

  }, [chat])

  const messagesEndRef = useRef<null | HTMLDivElement>(null)
  const scrollToBottom = () => {
    if (!messagesEndRef.current) return

    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(scrollToBottom, [chat, isLoading])

  const onTextChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setMessage({ ...message, [e.target.name]: e.target.value });
  };

  const submitMessage = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    message.uuid = uuidv4()

    try {
      setIsMessageSubmitting(true)
      setChatToStore({ ...chat, messages: [...chat!.messages, Object.assign(message, { isMessageSubmitting: true })] })

      const response = await API.sendMessage(message)
      socket.emit('inputMessage', { message, room: chat?.chatId });

      setChatToStore({ ...chat, messages: Object.assign([], chat?.messages, { [chat?.messages.length!]: response.message }) })
      // setChatToStore({ ...chat, messages: chat?.messages.fill(response.message, chat.messages.length - 1)! })
    } catch (error) {
      console.log({ error })
    } finally {
      setIsMessageSubmitting(false)
    }

    setMessage({ ...message, text: '' })
  };

  const closeChatWindow = () => {
    router.push('/chat')
  }

  const renderChat = () => {
    return (
      <ul className={classes.scroll}>
        {chat?.messages.map(({ text, sender, senderId, isMessageSubmitting, sentAt }: ChatMessage, index: number) => (
          <li key={index}>
            <Message
              text={text}
              sender={sender}
              senderId={senderId}
              profileId={profile?.userId}
              isMessageSubmitting={isMessageSubmitting}
              sentAt={sentAt}
            />
          </li>
        ))}
        <div ref={messagesEndRef} />
      </ul>
    );
  };

  return (
    <MainLayout title='Chat'>
      {isLoading ? <div className={classes.loader}>
        <CircularProgress color='primary' />
      </div> :
        <div className={classes.root}>
          <div className={classes.chatWindow}>
            <IconButton
              size='small'
              onClick={closeChatWindow}
              className={classes.closeButton}
            >
              <CloseIcon />
            </IconButton>
            {renderChat()}
          </div>
          <Grid container>
            <Grid item sm={10}>
              <TextField
                className={classes.input}
                name='text'
                onChange={(e) => onTextChange(e)}
                value={message.text}
                placeholder="Enter message"
                label='Message'
                variant='outlined'
                InputProps={{
                  classes: {
                    notchedOutline: classes.notchedOutline,
                  }
                }}
              />
            </Grid>
            <Grid item sm={2}>
              <Button
                onClick={submitMessage}
                fullWidth
                loading={false}
                disabled={!message.text || isMessageSubmitting}
                color='primary'
                type='submit'
              >
                Send
          </Button>
            </Grid>
          </Grid>
        </div>}
    </MainLayout>
  )
})

export default ChatWindow
export const getServerSideProps: GetServerSideProps = withAuthServerSideProps();