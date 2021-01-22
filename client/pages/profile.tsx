import React, { useState } from 'react';
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
import { useUserStore } from '../providers/RootStoreProvider';
import TextField from '../components/common/TextField';
import PasswordTextField from '../components/common/PasswordTextField';
import Button from '../components/common/Button';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { GetServerSideProps } from 'next';

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
    margin: '15px auto',
    maxWidth: 430,
    '& .MuiFormGroup-root': {
      backgroundColor: 'rgba(255, 255, 255, .2)'
    }


    
  },
  radioField: {
    // ...theme.typography.subtitle,
    color: theme.palette.primary.main,
    marginRight: 60
  },
  buttonsBlock: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  button: {
    width: 180
  },
  modalButton: {
    margin: '0 auto',
    width: 200
  }
}));

const Profile = observer(function Profile() {
  const classes = useStyles();
  const { user } = useUserStore();

  const [isLoading, setLoading] = useState(false)
  const [isDeleteDialogOpen, setOpenRemoveDialog] = useState(false);

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

  const deleteProfile = () => {
    // deleteProfile();
  };

  return (
    <MainLayout title='Profile'>
      {/* {user && <h2>User name: `${user.firstName} ${user.lastName}`</h2>} */}

      <div className={classes.root}>
        <Typography className={classes.title}>
          My Profile
          </Typography>
        <Formik
          enableReinitialize
          onSubmit={handleSubmit}
          initialValues={{
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            gender: user?.gender || '',
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
             
                <FormControl component="fieldset" >

                  <RadioGroup
                  className={classes.genderBlock}
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
                    onClick={handleOpenDialog}
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
        loading={false}
        open={isDeleteDialogOpen}
        onClose={handleCloseDialog}
        onSubmit={deleteProfile}
      >
        Are you sure that you want to delete this account?
      </ConfirmDialog>
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
