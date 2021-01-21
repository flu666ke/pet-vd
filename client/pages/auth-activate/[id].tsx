import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import { makeStyles } from '@material-ui/core/styles';
import API from '../../services/api';
import { useErrorStore, useNoticeStore } from '../../providers/RootStoreProvider';

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

  const errorStore = useErrorStore()
  const noticeStore = useNoticeStore()

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (router.query.id) {
      const confirmAuth = async () => {
        try {
          setLoading(true)
          const response = await API.confirmAuth({ activationId: router.query.id })
          noticeStore.setNotice(response.message)

          if (response) {
            router.push('/')
          }
        } catch (error) {
          errorStore.setError(error.response.data.error.message)
          router.push('/signin')
        } finally {
          setLoading(false)
        }
      }
      confirmAuth()
    }
  }, [router.query.id]);

  return <h1 className={classes.root}>{loading && 'Loader.....'}Confirmation of registration</h1>

};


