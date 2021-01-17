import { useState } from 'react'
// import Link from 'next/link'
import { Formik, Form } from "formik";
import { FormControl, makeStyles, Theme, Typography } from "@material-ui/core";
import Button from "../components/common/Button";
import TextField from '../components/common/TextField'
import PasswordTextField from '../components/common/PasswordTextField'
import { MainLayout } from '../components/MainLayout';
import { SignupSchema } from '../services/validationSchemas';
import { RegisterData } from "../interfaces";
import API from "../services/api";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    maxWidth: 630,
    width: '100%',
    margin: '0 auto',
    padding: '55px 15px 25px'
  },
  title: {
    marginTop: 20,
    textAlign: "center",
    color: theme.palette.primary.light,
  },
  form: {
    marginTop: 25,
  },
  control: {
    marginBottom: 52,
  },
  button: {
    marginTop: 43,
  },
}));

export default function SignUp() {
  const classes = useStyles();

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (values: RegisterData) => {

    try {
      setLoading(true)

      const response = await API.signUp(values)
      console.log({ response })

      setMessage(response.message)
      setErrors('')

    } catch (error) {
      setErrors(error.response.data)

      console.log({ errors })
    } finally {
      setLoading(false)
    }
  };

  return (
    <MainLayout title='Registration' message={message} errors={errors}>
      <div className={classes.root}>
        <Typography component='h2' variant='h2' className={classes.title}>
          Registration
        </Typography>
        <div>
          <Formik
            enableReinitialize
            onSubmit={handleSubmit}
            validationSchema={SignupSchema}
            // initialErrors={errors}
            initialValues={{
              firstName: "",
              lastName: "",
              email: "",
              password: "",
              confirmPassword: "",
            }}
          >
            {({ isValid }) => (
              <Form className={classes.form}>
                <FormControl className={classes.control} fullWidth>
                  <TextField
                    placeholder='Enter First Name'
                    label='First Name'
                    name='firstName'
                  />
                </FormControl>
                <FormControl className={classes.control} fullWidth>
                  <TextField
                    placeholder='Enter Last Name'
                    label='Last Name'
                    name='lastName'
                  />
                </FormControl>
                <FormControl className={classes.control} fullWidth>
                  <TextField
                    placeholder='Enter email'
                    label='Email'
                    name='email'
                  />
                </FormControl>
                <FormControl className={classes.control} fullWidth>
                  <PasswordTextField
                    placeholder='Enter password'
                    label='Password'
                    name='password'
                  />
                </FormControl>
                <FormControl className={classes.control} fullWidth>
                  <PasswordTextField
                    placeholder="Enter Password Again"
                    label="Confirm Password"
                    name="confirmPassword"
                  />
                </FormControl>
                <FormControl fullWidth className={classes.button}>
                  <Button
                    fullWidth
                    disabled={!isValid}
                    color="secondary"
                    size="normal"
                    type="submit"
                    loading={loading}
                  >
                    Register
                  </Button>

                </FormControl>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </MainLayout>
  );
};
