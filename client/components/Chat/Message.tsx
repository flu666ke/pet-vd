import { makeStyles, Theme } from '@material-ui/core';
import { formattedDate } from '../../services/utils';

const useStyles = makeStyles((theme: Theme) => ({
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
    minWidth: 125,
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
    backgroundColor: theme.palette.primary.main,
    borderRadius: 8,
    padding: 10,
  },
  messageSubmitting: {
    ...theme.typography.subtitle1,
    color: theme.palette.primary.light,
    opacity: '.4'
  },
  text: {
    ...theme.typography.subtitle1,
    color: theme.palette.primary.light
  },
  sender: {
    ...theme.typography.subtitle2,
    color: theme.palette.primary.light
  },
  date: {
    fontSize: 11,
    color: theme.palette.primary.light,
  }
}));

interface MessageProps {
  text: string
  sender: string
  senderId: number | undefined
  profileId: number | undefined
  isMessageSubmitting: boolean | undefined
  sentAt: Date | undefined
}

export default function Message({ text, sender, senderId, profileId, isMessageSubmitting, sentAt }: MessageProps) {
  const classes = useStyles();

  return (
    <div className={classes.messageBlock} >
      {senderId == profileId ?
        <div className={classes.messageRightSide}>
          <div className={classes.date}>{sentAt ? formattedDate(sentAt) : ''}</div>
          {isMessageSubmitting ? <span className={classes.messageSubmitting}> {text}</span> : <span className={classes.text}>{text}</span>}
        </div> :

        <div className={classes.messageLeftSide}>
          <div className={classes.date}>{sentAt ? formattedDate(sentAt) : ''}</div>
          <span className={classes.sender}>{sender}:</span> <span className={classes.text}>{text}</span>
        </div>}
    </div>
  );
};