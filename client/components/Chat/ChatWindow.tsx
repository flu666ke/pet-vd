import { CircularProgress, Grid, IconButton, makeStyles, TextField, Theme } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { observer } from 'mobx-react-lite';
import React, { ChangeEvent } from 'react';
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
    backgroundColor: theme.palette.background.default,
    border: `2px solid ${theme.palette.primary.main}`,
    borderRadius: 6,
    margin: '40px auto'
  },
  notchedOutline: {
    borderWidth: 2
  },
  text: {
    ...theme.typography.subtitle1,
    color: theme.palette.secondary.light,
    marginTop: 0,
    marginBottom: 30,
    paddingLeft: 0,
    overflow: "auto",
    overflowX: "hidden",
    maxHeight: 396,
    "&::-webkit-scrollbar": {
      width: 7,
    },
    "&::-webkit-scrollbar-track": {
      boxShadow: "inset 0 0 6px rgba(0,0,0,0.3)",
      backgroundColor: theme.palette.secondary.main,
      borderRadius: 6,
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: theme.palette.secondary.main,
      borderRadius: 6,
    },
  },
  messageBlock: {
    display: "flex",
    marginBottom: 20,
    marginRight: 7,
  },
  message: {
    margin: "auto",
    marginRight: 10,
    marginTop: 10,
    listStyleType: "none",
    wordBreak: "break-word",
    textIndent: 35,
    backgroundColor: theme.palette.secondary.main,
    borderRadius: 8,
    padding: 10,
  },
  input: {
    width: '96%',
    color: theme.palette.primary.light,
  },
  closeButton: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.light,
    position: 'absolute',
    top: 0,
    left: 0
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
  text: string
  isLoading: boolean
  chat: any
}

const ChatWindow = observer(function ChatWindow(
  {
    closeChatWindow,
    onTextChange,
    submitMessage,
    text,
    isLoading,
    chat
  }: ChatWindowProps) {
  const classes = useStyles();

  const renderChat = () => {
    return (
      <ul className={classes.text}>
        {chat.map(({ text, senderId }: { text: any, senderId: any }, index: any) => (
          <li className={classes.messageBlock} key={index}>
            <p className={classes.message}>
              {senderId}: <span>{text}</span>
            </p>
          </li>
        ))}
        {/* <div ref={messagesEndRef} /> */}
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
            disabled={false}
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
