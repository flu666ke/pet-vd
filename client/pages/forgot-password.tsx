import { useState } from "react";
import { Formik, Form } from "formik";
import { makeStyles, FormControl, Typography } from "@material-ui/core";

import Button from "../components/common/Button";
import TextField from '../components/common/TextField'
import { MainLayout } from "../components/MainLayout";
import { ForgotPasswordSchema } from "../services/validationSchemas";
import API from "../services/api";
import { useErrorStore, useNoticeStore } from "../providers/RootStoreProvider";

const useStyles = makeStyles((theme) => ({
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
    marginBottom: 45,
  },
}));

export default function ForgotPassword() {
  const classes = useStyles();

  const { setError } = useErrorStore()
  const { setNotice } = useNoticeStore()

  const [isLoading, setLoading] = useState(false)

  const handleSubmit = async ({ email }: { email: string }) => {

    try {
      setLoading(true)
      const response = await API.forgotPassword(email)
      setNotice(response.message)
    } catch (error) {
      setError(error.response.data?.error)
    } finally {
      setLoading(false)
    }
  };

  return (
    <MainLayout title={'Forgot password'}>
      <div className={classes.root}>
        <Typography className={classes.title}>
          Forgot Password
      </Typography>
        <Formik
          // enableReinitialize
          onSubmit={handleSubmit}
          initialValues={{
            email: "",
          }}
          // initialErrors={errors}
          validationSchema={ForgotPasswordSchema}
        >
          {({ isValid }) => (
            <Form>
              <FormControl className={classes.formControl} fullWidth>
                <TextField name='email' label='Email' placeholder='Enter Email' />
              </FormControl>
              <Button
                type='submit'
                loading={isLoading}
                size="normal"
                color="secondary"
                fullWidth
                disabled={!isValid}
              >
                Restore
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </MainLayout>
  );
};
