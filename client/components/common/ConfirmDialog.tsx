import { makeStyles, Theme } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from './Button';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    '& .MuiBackdrop-root': {
      backgroundColor: 'rgba(255, 255, 255, .6)'
    }
  },
  paper: {
    minWidth: 520,
    boxShadow:
      '0 12px 15px 0 rgba(0, 0, 0, 0.24), 0 17px 50px 0 rgba(0, 0, 0, 0.19)'
  },
  contentRoot: {
    padding: '75px 30px 30px',

    '&:first-child': {
      paddingTop: '75px'
    }
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0
  },
  message: {
    textAlign: 'center',
    marginBottom: 56
  },
  button: {
    width: 160
  },
  buttonsRow: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  circularPrimary: {
    color: "#fff",
  },
  circularSecondary: {
    color: theme.palette.primary.main,
  },
}))

const ConfirmDialog = ({
  children,
  onSubmit,
  onClose,
  loading,
  ...restProps
}: any) => {
  const classes = useStyles();


  return (
    <Dialog
      open={false}
      onClose={onClose}
      classes={{
        paper: classes.paper,
        root: classes.root
      }}
      {...restProps}
    >
      <IconButton
        onClick={onClose}
        className={classes.closeButton}
        aria-label="close-modal"
      >
        <CloseIcon />
      </IconButton>
      <DialogContent
        classes={{
          root: classes.contentRoot
        }}
      >
        <div className={classes.message}>{children}</div>
        <div className={classes.buttonsRow}>
          <div className={classes.button}>
            <Button fullWidth color="secondary" onClick={onClose}>
              no
            </Button>
          </div>
          <div className={classes.button}>
            <Button fullWidth onClick={onSubmit} disabled={loading} color='primary'>
              {loading ? (
                <CircularProgress
                  size={30}
                  classes={{
                    colorPrimary: classes.circularPrimary,
                    colorSecondary: classes.circularSecondary
                  }}
                />
              ) : (
                  'yes'
                )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDialog;