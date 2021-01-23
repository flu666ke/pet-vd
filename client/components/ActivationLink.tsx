import { makeStyles, Theme } from '@material-ui/core';
import { useState } from 'react'
import Button from '../components/common/Button'
import { useNoticeStore } from '../providers/RootStoreProvider'
import API from '../services/api'

const useStyles = makeStyles((theme: Theme) => ({
  title: {
    ...theme.typography.subtitle1,
    color: theme.palette.primary.light,
    textAlign: 'center'
  },
}));

export default function ActivationLinkExpired({ email }: { email: string }) {
  const classes = useStyles();
  const [loading, setLoading] = useState(false)
  const { setNotice } = useNoticeStore()

  const getActivationLink = async () => {
    try {
      setLoading(true)
      const response = await API.getActivationLink(email)
      setNotice(response.message)
    } catch (error) {
      console.log({ error })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <p className={classes.title}>Activation link expired. For a new activation link enter your email and click here.</p>
      <Button
        onClick={getActivationLink}
        fullWidth
        color="secondary"
        size="normal"
        type="submit"
        loading={loading}
        disabled={!email}
      >
        Get activation link
        </Button>
    </>
  );
};