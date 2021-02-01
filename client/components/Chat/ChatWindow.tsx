import { CircularProgress, Grid, IconButton, makeStyles, TextField, Theme } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { observer } from 'mobx-react-lite';
import React, { ChangeEvent, useEffect, useRef } from 'react';
import { ChatMessage } from '../../pages/chat';
import Button from '../common/Button';

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
  text: {
    ...theme.typography.subtitle1,
    color: theme.palette.primary.light,
    marginTop: 0,
    marginBottom: 30,
    paddingLeft: 0,
    overflow: "auto",
    overflowX: "hidden",
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
  messageBlock: {
    display: "flex",
    marginBottom: 20,
    marginRight: 7,
  },
  messageRightSide: {
    margin: "auto",
    marginRight: 10,
    marginTop: 10,
    listStyleType: "none",
    wordBreak: "break-word",
    // textIndent: 35,
    backgroundColor: theme.palette.primary.main,
    borderRadius: 8,
    padding: 10,
  },
  messageLeftSide: {
    margin: "auto",
    marginLeft: 10,
    marginTop: 10,
    listStyleType: "none",
    wordBreak: "break-word",
    // textIndent: 35,
    backgroundColor: theme.palette.secondary.main,
    borderRadius: 8,
    padding: 10,
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
  }
}));

interface ChatWindowProps {
  closeChatWindow: () => void
  onTextChange: (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void
  submitMessage: (e: React.MouseEvent<HTMLButtonElement>) => void
  profileId: number | undefined
  text: string
  isLoading: boolean
  chat: ChatMessage[]
}

const ChatWindow = observer(function ChatWindow(
  {
    closeChatWindow,
    onTextChange,
    submitMessage,
    profileId,
    text,
    isLoading,
    chat
  }: ChatWindowProps) {
  const classes = useStyles();

  const messagesEndRef = useRef<null | HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (!messagesEndRef.current) return

    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [chat, isLoading])

  const renderChat = () => {
    return (
      <ul className={classes.text}>
        {chat.map(({ text, sender, userId }: ChatMessage, index: number) => (
          <li className={classes.messageBlock} key={index}>
            {userId == profileId ?
              <p className={classes.messageRightSide}>
                <span>{text}</span> :{sender}
              </p> :
              <p className={classes.messageLeftSide}>
                {sender}: <span>{text}</span>
              </p>}
          </li>
        ))}
        <div ref={messagesEndRef} />
      </ul>
    );
  };

  if (isLoading) {
    return <div className={classes.loader}>
      <CircularProgress color='primary' />
    </div>
  }

  return (
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
            value={text}
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
            disabled={!text}
            color='primary'
            type='submit'
          >
            Send
          </Button>
        </Grid>
      </Grid>
    </div>
  )
})

export default ChatWindow
