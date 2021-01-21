import React, { useState } from 'react';
import {
  makeStyles,
  FormControl,
  Typography,
  Grid,
} from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import { Formik, Form } from 'formik';
import { MainLayout } from '../components/MainLayout';
import { ProfileSchema } from '../services/validationSchemas'
import { useUserStore } from '../providers/RootStoreProvider';
import TextField from '../components/common/TextField';
import PasswordTextField from '../components/common/PasswordTextField';
import Button from '../components/common/Button';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { GetServerSideProps } from 'next';

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 600,
    width: '100%',
    margin: 0
  },
  title: {
    textAlign: 'center',
    marginBottom: 30,
    color: theme.palette.primary.light,
  },
  input: {
    marginBottom: 50
  },
  rightCol: {
    display: 'flex'
  },
  button: {
    marginTop: 'auto',
    marginLeft: 'auto',
    width: 180
  },
  message: {
    // ...theme.typography.menu,
    margin: '0 auto 35px',
    color: theme.palette.primary.main,
    textAlign: 'center'
  },
  modalButton: {
    margin: '0 auto',
    width: 200
  }
}));

const Profile = observer(function Profile() {
  const classes = useStyles();
  const userStore = useUserStore();

  const [isLoading, setLoading] = useState(false)
  const [isOpenRemoveDialog, setOpenRemoveDialog] = useState(false);

  const handleOpenDialog = () => {
    setOpenRemoveDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenRemoveDialog(false);
  };

  const handleSubmit = (values: any) => {

    console.log({ values })

    // changeProfile(dataToChange);
  };

  const handleDeleteAccount = () => {
    // deleteProfile();
  };

  return (
    <MainLayout title='Profile'>
      {userStore.user && <h2>User name: `${userStore.user.firstName} ${userStore.user.lastName}`</h2>}

      <Grid container>
        <Grid item sm={6}>
          <div className={classes.root}>
            <Typography variant="h2" className={classes.title}>
              My Profile
          </Typography>
            <Formik
              enableReinitialize
              onSubmit={handleSubmit}
              initialValues={{
                firstName: userStore.user?.firstName || '',
                lastName: userStore.user?.lastName || '',

                oldPassword: '',
                newPassword: '',
                confirmNewPassword: ''
              }}
              // initialErrors={errors}
              validationSchema={ProfileSchema}
            >
              {({
                isValid,
                // handleBlur,
                // handleChange,
                // setFieldValue,
                // values,
                // dirty
              }) => (
                <Form>
                  <FormControl className={classes.input} fullWidth>
                    <TextField
                      placeholder="Enter First Name"
                      label="First Name"
                      name="firstName"
                    />
                  </FormControl>
                  <FormControl className={classes.input} fullWidth>
                    <TextField
                      placeholder="Enter Last Name"
                      label="Last Name"
                      name="lastName"
                    />
                  </FormControl>

                  <Typography variant="h2" className={classes.title}>
                    Change Password
                </Typography>
                  <FormControl className={classes.input} fullWidth>
                    <PasswordTextField
                      placeholder="Type Old Password"
                      label="Old Password"
                      name="oldPassword"
                    />
                  </FormControl>
                  <FormControl className={classes.input} fullWidth>
                    <PasswordTextField
                      placeholder="Type New Password"
                      label="New Password"
                      name="newPassword"
                    />
                  </FormControl>
                  <FormControl className={classes.input} fullWidth>
                    <PasswordTextField
                      placeholder="Type New Password Again"
                      label="Confirm New Password"
                      name="confirmNewPassword"
                    />
                  </FormControl>
                  <div className={classes.button}>
                    <Button
                      fullWidth
                      loading={isLoading}
                      disabled={!isValid}
                      color="secondary"
                      type="submit"
                    >
                      Save
                  </Button>
                  </div>
                  {/* <Prompt
                  when={dirty}
                  message={() =>
                    'There are unsaved changes. Are you sure to leave the page?'
                  }
                /> */}
                </Form>
              )}
            </Formik>
          </div>
        </Grid>
        <Grid item sm={6} className={classes.rightCol}>

          <div className={classes.button}>
            <Button onClick={handleOpenDialog} color="primary" fullWidth loading={isLoading}>
              Delete Account
            </Button>
          </div>

        </Grid>
        <ConfirmDialog
          loading={false}
          open={isOpenRemoveDialog}
          onClose={handleCloseDialog}
          onSubmit={handleDeleteAccount}
        >
          <p className={classes.message}>
            Are you sure that you want to delete this account?
        </p>
        </ConfirmDialog>
      </Grid>

    </MainLayout>
  )
})

export default Profile

export const getServerSideProps: GetServerSideProps = async function getServerSideProps(
  ctx
) {

  let error = null
  let profile = null

  const cookie = ctx.req.headers.cookie
  console.log({ cookie })

  const response = await fetch(`http://localhost:5000`, { headers: { cookie: cookie! } })

  if (response.status === 200) {
    const { user } = await response.json()
    profile = {
      firstName: user.firstName,
      lastName: user.lastName
    }
  } else if (response.status === 401) {
    error = response.statusText
  }

  return {
    props: {
      hydrationData: {
        error: error,
        user: profile
      },
    },
  };
};
