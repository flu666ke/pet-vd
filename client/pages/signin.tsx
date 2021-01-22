import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router'
import { Formik, Form } from 'formik';
import { makeStyles, Theme } from '@material-ui/core';
import { Typography, FormControl } from '@material-ui/core';

import Button from "../components/common/Button";
import TextField from '../components/common/TextField'
import PasswordTextField from '../components/common/PasswordTextField'
import { MainLayout } from '../components/MainLayout';
import ActivationLinkExpired from '../components/ActivationLink';
import { SignInSchema } from '../services/validationSchemas';
import { LoginData } from '../interfaces';
import API from '../services/api';
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
  buttonWrapper: {
    marginBottom: 40
  },
  linkWrapper: {
    textAlign: 'center',
    marginBottom: 40,
    "& a": {
      color: theme.palette.primary.light,
      textTransform: 'uppercase',
      textDecoration: 'none'
    },
  },
}));

export default function SignIn() {
  const classes = useStyles();
  const router = useRouter()
  const { setError } = useErrorStore()
  const { setNotice } = useNoticeStore()

  const [isLoading, setLoading] = useState(false)
  const [isActivationLinkShow, setIsActivationLinkShow] = useState(false)
  const [email, setEmail] = useState('')

  const handleSubmit = async (loginData: LoginData) => {

    setEmail(loginData.email)

    try {
      setLoading(true)
      const response = await API.signIn(loginData)
      router.push('/')
      setNotice(response.message)
    } catch (error) {
      setError(error.response.data.error.message)

      if (error.response.data?.error?.code === 'EXPIRED_LINK') {
        setIsActivationLinkShow(true)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <MainLayout title='Login'>
      <div className={classes.root}>
        <Typography className={classes.title}>
          Login
      </Typography>
        <Formik
          // enableReinitialize
          onSubmit={handleSubmit}
          validationSchema={SignInSchema}
          // initialErrors={errors}
          initialValues={{
            email: '',
            password: ''
          }}
        >
          {({ values, isValid }) => (
            <Form>
              <FormControl fullWidth className={classes.formControl}>
                <TextField
                  name="email"
                  label="Email"
                  placeholder="Enter Email"
                />
              </FormControl>
              <FormControl fullWidth className={classes.formControl}>
                <PasswordTextField
                  name="password"
                  label="Password"
                  placeholder="Enter Password"
                />
              </FormControl>
              <div className={classes.buttonWrapper}>
                <Button
                  disabled={!isValid}
                  type="submit"
                  fullWidth
                  size="normal"
                  color="secondary"
                  loading={isLoading}
                >
                  Login
              </Button>
              </div>
              <div className={classes.linkWrapper}>
                <p><Link href='/forgot-password'><a>Forgot Password?</a></Link></p>
              </div>
            </Form>
          )}
        </Formik>
        {isActivationLinkShow && <ActivationLinkExpired email={email} />}
      </div>
    </MainLayout>
  );
};
