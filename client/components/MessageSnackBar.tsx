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
}

export default function MessageSnackBar(props: MessageSnackBarProps) {
  const classes = useStyles();

  console.log(props)

  const handleClose = (_: any, reason: any) => {
    console.log({ _, reason })
    if (reason === 'clickaway') {
      return;
    }

    // onClear();
  };

  if (!props) return null;

  const isOpen = !!props.text;
  const Icon = variantIcon[props.type];

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
          className={clsx(classes[props.type])}
          message={
            <span className={classes.message}>
              <Icon className={classes.icon} />
              {props.text}
            </span>
          }
          action={[
            <IconButton
              key="close"
              aria-label="close"
              color="inherit"
            // onClick={handleClose}
            >
              <CloseIcon className={classes.closeIcon} />
            </IconButton>
          ]}
        />
      </Snackbar>
    </div>
  );
};