import { useState } from 'react'
import { Formik, Form } from "formik";
import { FormControl, makeStyles, Theme, Typography } from "@material-ui/core";

import Button from "../../components/common/Button";
import TextField from '../../components/common/TextField'
import { MainLayout } from '../../components/MainLayout';
import { SignupSchema } from '../../services/validationSchemas';
import { IRegisterData } from "../../interfaces";
import API from "../../services/api";
import { useErrorStore, useNoticeStore, useProfileStore } from '../../providers/RootStoreProvider';

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

export default function CreateVoting() {
  const classes = useStyles();

  const { setError } = useErrorStore()
  const { setNotice } = useNoticeStore()
  const { profile } = useProfileStore();

  const [loading, setLoading] = useState(false)

  const handleSubmit = async (values: any) => {
    values.creatorId = profile?.userId
    try {
      setLoading(true)
      const response = await API.createVoting(values)
      setNotice(response.message)
    } catch (error) {
      setError(error.response.data?.error)
    } finally {
      setLoading(false)
    }
  };

  return (
    <MainLayout title='Voting'>
      <div className={classes.root}>
        <Typography className={classes.title}>
          Create Voting
        </Typography>
        <div>
          <Formik
            enableReinitialize
            onSubmit={handleSubmit}
            // validationSchema={SignupSchema}
            // initialErrors={errors}
            initialValues={{
              title: '',
              option1: '',
              option2: '',
              option3: '',
              option4: '',
            }}
          >
            {({ isValid }) => (
              <Form >
                <FormControl className={classes.formControl} fullWidth>
                  <TextField
                    placeholder='Enter Title'
                    label='Title'
                    name='title'
                  />
                </FormControl>
                <FormControl className={classes.formControl} fullWidth>
                  <TextField
                    placeholder='Enter Option #1'
                    label='Option #1'
                    name='option1'
                  />
                </FormControl>
                <FormControl className={classes.formControl} fullWidth>
                  <TextField
                    placeholder='Enter Option #2'
                    label='Option #2'
                    name='option2'
                  />
                </FormControl>
                <FormControl className={classes.formControl} fullWidth>
                  <TextField
                    placeholder='Enter Option #3'
                    label='Option #3'
                    name='option3'
                  />
                </FormControl>
                <FormControl className={classes.formControl} fullWidth>
                  <TextField
                    placeholder='Enter Option #4'
                    label='Option #4'
                    name='option4'
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
                  Create Voting
                  </Button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </MainLayout>
  );
};
