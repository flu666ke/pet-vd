import { useEffect } from 'react';
import { useRouter } from 'next/router'
import { makeStyles, Theme } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

import API from '../../services/api';
import { useErrorStore, useNoticeStore } from '../../providers/RootStoreProvider';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: 'calc(100vh - 64px)',
    background: theme.palette.background.default,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
}));

export default function AuthActivation() {
  const classes = useStyles();
  const router = useRouter()

  const { setError } = useErrorStore()
  const { setNotice } = useNoticeStore()

  useEffect(() => {
    if (router.query.id) {
      const confirmAuth = async () => {
        try {
          const response = await API.confirmAuth({ activationId: router.query.id })
          setNotice(response.message)
          router.push('/')
        } catch (error) {
          setError(error.response.data.error)
          router.push('/signin')
        }
      }
      confirmAuth()
    }
  }, [router.query.id]);

  return <div className={classes.root}>
    <CircularProgress color='primary' />
  </div>
};


