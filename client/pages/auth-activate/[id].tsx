import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import { makeStyles } from '@material-ui/core/styles';
import API from '../../services/api';

const useStyles = makeStyles(() => ({
  root: {
    height: 'calc(100vh - 64px)',
    background: '#fff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
}));

export default function AuthActivation() {
  const classes = useStyles();
  const router = useRouter()

  useEffect(() => {
    if (router.query.id) {
      const load = async () => {
        try {

          const response = await API.confirmAuth({ activationId: router.query.id })

          console.log({ response })

          if (response) {
            router.push('/')
          }
        } catch (error) {
          console.log({ error })
          router.push('/signin')
        }


      }
      load()
    }
  }, [router.query.id]);

  return <h1 className={classes.root}>Confirmation of registration</h1>

};


