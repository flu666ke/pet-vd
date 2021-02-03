import { useState } from 'react'
import { Formik, Form } from "formik";
import { FormControl, makeStyles, Theme, Typography } from "@material-ui/core";

import Button from "../components/common/Button";
import TextField from '../components/common/TextField'
import PasswordTextField from '../components/common/PasswordTextField'
import { MainLayout } from '../components/MainLayout';
import { SignupSchema } from '../services/validationSchemas';
import { IRegisterData } from "../interfaces";
import API from "../services/api";
import { useErrorStore, useNoticeStore } from '../providers/RootStoreProvider';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    maxWidth: 630,
    width: '100%',
    margin: '0 auto',
    padding: '55px 15px 25px'
  },
  title: {
    ...theme.typography.h2,
    textAlign: 'center',
    marginBottom: 30,
    color: theme.palette.primary.light,
  },
  formControl: {
    marginBottom: 45
  },
}));

export default function SignUp() {
  const classes = useStyles();

  const { setError } = useErrorStore()
  const { setNotice } = useNoticeStore()

  const [loading, setLoading] = useState(false)

  const handleSubmit = async (values: IRegisterData) => {
    try {
      setLoading(true)
      const response = await API.signUp(values)
      setNotice(response.message)
    } catch (error) {
      setError(error.response.data?.error)
    } finally {
      setLoading(false)
    }
  };

  return (
    <MainLayout title='Registration'>
      <div className={classes.root}>
        <Typography className={classes.title}>
          Registration
        </Typography>
        <div>
          <Formik
            enableReinitialize
            onSubmit={handleSubmit}
            validationSchema={SignupSchema}
            // initialErrors={errors}
            initialValues={{
              firstName: '',
              lastName: '',
              email: '',
              password: '',
              confirmPassword: '',
            }}
          >
            {({ isValid }) => (
              <Form >
                <FormControl className={classes.formControl} fullWidth>
                  <TextField
                    placeholder='Enter First Name'
                    label='First Name'
                    name='firstName'
                  />
                </FormControl>
                <FormControl className={classes.formControl} fullWidth>
                  <TextField
                    placeholder='Enter Last Name'
                    label='Last Name'
                    name='lastName'
                  />
                </FormControl>
                <FormControl className={classes.formControl} fullWidth>
                  <TextField
                    placeholder='Enter email'
                    label='Email'
                    name='email'
                  />
                </FormControl>
                <FormControl className={classes.formControl} fullWidth>
                  <PasswordTextField
                    placeholder='Enter password'
                    label='Password'
                    name='password'
                  />
                </FormControl>
                <FormControl className={classes.formControl} fullWidth>
                  <PasswordTextField
                    placeholder="Enter Password Again"
                    label="Confirm Password"
                    name="confirmPassword"
                  />
                </FormControl>
                <Button
                  fullWidth
                  disabled={!isValid}
                  color="primary"
                  size="normal"
                  type="submit"
                  loading={loading}
                >
                  Register
                  </Button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </MainLayout>
  );
};
