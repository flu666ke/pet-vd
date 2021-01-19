import clsx from 'clsx';
import { green } from '@material-ui/core/colors';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import ErrorIcon from '@material-ui/icons/Error';
import CheckIcon from '@material-ui/icons/CheckCircle';
import { makeStyles } from '@material-ui/core/styles';
import { messagesTypes } from '../constants';
import { SyntheticEvent } from 'react';

const variantIcon = {
  [messagesTypes.success]: CheckIcon,
  [messagesTypes.error]: ErrorIcon
};

const useStyles = makeStyles(theme => ({
  [messagesTypes.success]: {
    backgroundColor: green[600]
  },
  [messagesTypes.error]: {
    backgroundColor: theme.palette.error.main
  },
  icon: {
    fontSize: 20,
    opacity: 0.9,
    marginRight: theme.spacing(1)
  },
  closeIcon: {
    fontSize: 20
  },
  message: {
    display: 'flex',
    alignItems: 'center'
  }
}));

interface MessageSnackBarProps {
  text: string
  type: string
  onClear: () => void
}

export default function MessageSnackBar(props: MessageSnackBarProps) {
  const classes = useStyles();

  const { text, type, onClear } = props

  const handleClose = (_: SyntheticEvent<any, Event>, reason: any) => {
    if (reason === 'clickaway') {
      return;
    }

    onClear();
  };

  if (!props) return null;

  const isOpen = !!text;
  const Icon = variantIcon[type];

  return (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
        open={isOpen}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <SnackbarContent
          className={clsx(classes[type])}
          message={
            <span className={classes.message}>
              <Icon className={classes.icon} />
              {text}
            </span>
          }
          action={[
            <IconButton
              key="close"
              color="inherit"
              onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => handleClose(event, MouseEvent)}
            >
              <CloseIcon className={classes.closeIcon} />
            </IconButton>
          ]}
        />
      </Snackbar>
    </div>
  );
};