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
import { useErrorStore, useNoticeStore } from '../../providers/RootStoreProvider';

const useStyles = makeStyles(theme => ({
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

export default function RestorePassword() {
  const classes = useStyles();
  const router = useRouter()
  const { setError } = useErrorStore()
  const { setNotice } = useNoticeStore()

  const [loading, setLoading] = useState(false)

  const handleSubmit = async ({ password }: { password: string }) => {
    try {
      setLoading(true)
      const response = await await API.restorePassword({ newPassword: password, resetPasswordLink: router.query.id })
      setNotice(response.message)
      router.push('/signin')
    } catch (error) {
      setError(error.response.data?.error?.message)
    } finally {
      setLoading(false)
    }
  };

  return (
    <MainLayout title={'Restore password'}>
      <div className={classes.root}>
        <Typography className={classes.title}>
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
                <Button
                  fullWidth
                  disabled={!isValid}
                  color="secondary"
                  size="normal"
                  type="submit"
                  loading={loading}
                >
                  Restore
                </Button>
              </Form>
            </>
          )}
        </Formik>
      </div>
    </MainLayout>
  );
};