
import { makeStyles, FormControl, Typography } from "@material-ui/core";
import { Formik, Form } from "formik";
import Button from "../components/common/Button";
import TextField from '../components/common/TextField'
import { MainLayout } from "../components/MainLayout";
import { ForgotPasswordSchema } from "../services/validationSchemas";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 630,
    width: '100%',
    margin: '0 auto',
    padding: '55px 15px 25px'
  },
  title: {
    textAlign: "center",
    marginBottom: 30,
    color: theme.palette.primary.light,
  },
  formControl: {
    marginBottom: 45,
  },
  button: {
    marginBottom: 45,
  },
}));

export default function ForgotPassword({ errors, isLoading, message }: any) {
  const classes = useStyles();

  const handleSubmit = (values: any) => {
    console.log(values);

  };

  return (
    <MainLayout title={'Forgot password'}>
      <div className={classes.root}>
        <Typography variant='h2' className={classes.title}>
          Forgot Password
      </Typography>
        <Formik
          // enableReinitialize
          onSubmit={handleSubmit}
          initialValues={{
            email: "",
          }}
          initialErrors={errors}
          validationSchema={ForgotPasswordSchema}
        >
          {({ isValid }) => (
            <Form>
              <FormControl className={classes.formControl} fullWidth>
                <TextField name='email' label='Email' placeholder='Enter Email' />
              </FormControl>
              <div className={classes.button}>
                <Button
                  type='submit'
                  loading={false}
                  size="normal"
                  color="secondary"
                  fullWidth
                  disabled={!isValid}
                >
                  Restore
              </Button>
              </div>
            </Form>
          )}
        </Formik>
        {errors ? errors : message}
      </div>
    </MainLayout>
  );
};
