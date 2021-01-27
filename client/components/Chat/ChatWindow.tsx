import { Grid, makeStyles, TextField, Theme } from '@material-ui/core';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import Button from '../common/Button';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: 500,
    margin: 40,
    backgroundColor: theme.palette.background.default,
  },
  chatWindow: {
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
}));

const chats = [
  { id: 1, message: 'Hello', sender: 'Mike' },
  { id: 2, message: 'Hi', sender: 'Floki' },
  { id: 1, message: 'Bye Bye', sender: 'Mike' },
  { id: 2, message: 'Bye', sender: 'Floki' },
  { id: 1, message: 'See you', sender: 'Mike' },
  { id: 2, message: 'See you too', sender: 'Floki' },
]

export default function ChatWindow() {
  const classes = useStyles();

  const [state, setState] = useState({ message: "", name: "" });

  useEffect(() => {
    // getChats()
    // socket.on("Output Chat Message", (messageFromBackEnd) => {
    //   console.log({ messageFromBackEnd })
    //   afterPostMessage(messageFromBackEnd)
    // setChat([...chat, ...messageFromBackEnd]);
    // setChat([...chat]);
    // });
  }, []);

  // const messagesEndRef = useRef(null);

  // const scrollToBottom = () => {
  //   if (!messagesEndRef.current) return;

  //   messagesEndRef.current!.scrollIntoView({ behavior: "smooth" });
  // };

  // useEffect(scrollToBottom, [chats]);

  const onTextChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const onMessageSubmit = (e: any) => {
    e.preventDefault();
    // const { name, message } = state;
    // socket.emit("Input Chat Message", {
    //   name,
    //   message,
    //   userId,
    //   userImage,
    //   nowTime,
    //   type,
    // });
    // setState({ message: "", name });
  };

  const renderChat = () => {
    return (
      <ul className={classes.text}>
        {chats.map(({ message, sender }, index) => (
          <li className={classes.messageBlock} key={index}>
            <p className={classes.message}>
              {sender}: <span>{message}</span>
            </p>
          </li>
        ))}
        {/* <div ref={messagesEndRef} /> */}
      </ul>
    );
  };

  return (
    <div className={classes.root}>
      <div className={classes.chatWindow}>
        {renderChat()}
      </div>
      <Grid container>
        <Grid item sm={10}>
          <TextField
            className={classes.input}
            name='message'
            onChange={(e) => onTextChange(e)}
            value={state.message}
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
            onClick={onMessageSubmit}
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
}
