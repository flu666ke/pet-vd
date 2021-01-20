import { useRouter } from 'next/router'
import { makeStyles, FormControl } from '@material-ui/core';
import { Formik, Form } from 'formik';
import Typography from '@material-ui/core/Typography';
import PasswordTextField from '../../components/common/PasswordTextField';
import Button from '../../components/common/Button';
import { RestorePasswordSchema } from '../../services/validationSchemas';
import { MainLayout } from '../../components/MainLayout';
import { useState } from 'react';
import API from '../../services/api';

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

  const router = useRouter()

  const [isLoading, setLoading] = useState(false)

  const [errors, setErrors] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (value: any) => {

    console.log({ value })

    try {
      setLoading(true)

      const response = await API.restorePassword({ newPassword: value.password, resetPasswordLink: router.query.id })
      console.log({ response })

      // setMessage(response.message)
      // setErrors('')
      // router.push('/')
    } catch (error) {


      setErrors(error.response.data)

      console.log({ errors })
    } finally {
      setLoading(false)
    }

  };

  return (
    <MainLayout title={'Restore password'}>
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
                    loading={isLoading}
                  >
                    Restore
                </Button>
                </div>

              </Form>
            </>
          )}
        </Formik>
      </div>
    </MainLayout>
  );
};