
import { makeStyles, FormControl } from '@material-ui/core';
import { Formik, Form } from 'formik';
import Typography from '@material-ui/core/Typography';
import PasswordTextField from '../components/common/PasswordTextField';
import Button from '../components/common/Button';
import { RestorePasswordSchema } from '../services/validationSchemas';

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 630,
    width: '100%',
    margin: '0 auto',
    padding: '55px 15px 25px'
  },

  title: {
    textAlign: 'center',
    marginBottom: 30
  },
  formControl: {
    marginBottom: 45
  },
  button: {
    marginBottom: 45
  },
  message: {
    // ...theme.typography.menu,
    margin: '0 auto 35px',
    // color: theme.palette.dark.lightBlack,
    textAlign: 'center'
  },
  modalButton: {
    margin: '0 auto',
    width: 200
  },
  modalGroupButtons: {
    display: 'flex',
    justifyContent: 'space-around'
  }
}));

export default function RestorePassword() {
  const classes = useStyles();


  const handleSubmit = (values: any) => {

    console.log({ values })
  };

  return (
    <div className={classes.root}>

      <Typography variant="h2" className={classes.title}>
        Restore Password
      </Typography>
      <Formik
        enableReinitialize
        onSubmit={handleSubmit}
        initialValues={{
          password: '',
          confirmPassword: ''
        }}
        // initialErrors={errors}
        validationSchema={RestorePasswordSchema}
      >
        {({ isValid, values }) => (
          <>
            <Form>
              <FormControl className={classes.formControl} fullWidth>
                <PasswordTextField
                  label="Password"
                  name="password"
                  placeholder="Enter Password"
                />
              </FormControl>
              <FormControl className={classes.formControl} fullWidth>
                <PasswordTextField
                  label="Confirm"
                  name="confirmPassword"
                  placeholder="Enter Password Again"
                />
              </FormControl>
              <div className={classes.button}>
                <Button
                  fullWidth
                  disabled={!isValid}
                  color="secondary"
                  size="normal"
                  type="submit"
                  loading={false}
                >
                  Restore
                </Button>
              </div>

            </Form>
          </>
        )}
      </Formik>
    </div>
  );
};