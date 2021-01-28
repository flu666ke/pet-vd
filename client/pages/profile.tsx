import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import {
  makeStyles,
  FormControl,
  Typography,
  Radio,
  FormControlLabel,
  RadioGroup,
  Theme,
} from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import { Formik, Form } from 'formik';

import { MainLayout } from '../components/MainLayout';
import { ProfileSchema } from '../services/validationSchemas'
import { useErrorStore, useNoticeStore, useProfileStore } from '../providers/RootStoreProvider';
import TextField from '../components/common/TextField';
import PasswordTextField from '../components/common/PasswordTextField';
import Button from '../components/common/Button';
import ConfirmDialog from '../components/common/ConfirmDialog';
import API from '../services/api';
import { withAuthServerSideProps } from '../hocs/withAuthServerSideProps';

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
  genderBlock: {
    maxWidth: 400,
    margin: ' 20px auto',
  },
  radioField: {
    ...theme.typography.subtitle1,
    color: theme.palette.primary.light,
    marginRight: 60
  },
  buttonsBlock: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  button: {
    width: 180
  },
}));

interface UpdateProfile {
  firstName: string
  lastName: string
  gender?: string
  newPassword?: string
  oldPassword?: string
}

const Profile = observer(function Profile() {
  const classes = useStyles();
  const router = useRouter()
  const { setError } = useErrorStore();
  const { setNotice } = useNoticeStore();
  const { profile, removeProfile } = useProfileStore();

  const [isLoading, setLoading] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const openConfirmDialog = () => {
    setIsDeleteDialogOpen(true);
  };

  const closeConfirmDialog = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleSubmit = async (profileData: UpdateProfile) => {
    try {
      setLoading(true)
      const response = await API.updateProfile(profileData)
      setNotice(response.message)
    } catch (error) {
      setError(error.response.data?.error)
    } finally {
      setLoading(false)
    }
  };

  const deleteAccount = async () => {
    try {
      setLoading(true)
      const response = await API.deleteAccount()
      setNotice(response.message)
      closeConfirmDialog()
      removeProfile()
      router.push('/signin')
    } catch (error) {
      setError(error.response.data?.error)
    } finally {
      setLoading(false)
    }
  };

  return (
    <MainLayout title='Profile'>
      <div className={classes.root}>
        <Typography className={classes.title}>
          My Profile
          </Typography>
        <Formik
          enableReinitialize
          onSubmit={handleSubmit}
          initialValues={{
            firstName: profile?.firstName || '',
            lastName: profile?.lastName || '',
            gender: profile?.gender || '',
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
            handleChange,
            // setFieldValue,
            values,
            // dirty
          }) => (
            <Form>
              <FormControl className={classes.formControl} fullWidth>
                <TextField
                  placeholder="Enter First Name"
                  label="First Name"
                  name="firstName"
                />
              </FormControl>
              <FormControl className={classes.formControl} fullWidth>
                <TextField
                  placeholder="Enter Last Name"
                  label="Last Name"
                  name="lastName"
                />
              </FormControl>
              <div className={classes.genderBlock}>
                <FormControl component="fieldset" >
                  <RadioGroup
                    name="gender"
                    value={values.gender}
                    onChange={handleChange}
                    row
                  >
                    <FormControlLabel
                      className={classes.radioField}
                      value="male"
                      control={<Radio color="primary" />}
                      label="Male"
                    />
                    <FormControlLabel
                      className={classes.radioField}
                      value="X"
                      control={<Radio color="primary" />}
                      label="X"
                    />
                    <FormControlLabel
                      className={classes.radioField}
                      value="female"
                      control={<Radio color="primary" />}
                      label="Female"
                    />
                  </RadioGroup>
                </FormControl>
              </div>
              <Typography className={classes.title}>
                Change Password
                </Typography>
              <FormControl className={classes.formControl} fullWidth>
                <PasswordTextField
                  placeholder="Type Old Password"
                  label="Old Password"
                  name="oldPassword"
                />
              </FormControl>
              <FormControl className={classes.formControl} fullWidth>
                <PasswordTextField
                  placeholder="Type New Password"
                  label="New Password"
                  name="newPassword"
                />
              </FormControl>
              <FormControl className={classes.formControl} fullWidth>
                <PasswordTextField
                  placeholder="Type New Password Again"
                  label="Confirm New Password"
                  name="confirmNewPassword"
                />
              </FormControl>
              <div className={classes.buttonsBlock}>
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
                <div className={classes.button}>
                  <Button
                    onClick={openConfirmDialog}
                    color="primary"
                    fullWidth
                    loading={isLoading}
                  >
                    Delete Account
            </Button>
                </div>
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

      <ConfirmDialog
        loading={isLoading}
        open={isDeleteDialogOpen}
        onClose={closeConfirmDialog}
        onSubmit={deleteAccount}
      >
        Are you sure that you want to delete this account?
      </ConfirmDialog>
    </MainLayout>
  )
})

export default Profile
export const getServerSideProps: GetServerSideProps = withAuthServerSideProps();
