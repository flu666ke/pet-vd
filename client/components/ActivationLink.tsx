import { useState } from 'react'
import Button from '../components/common/Button'
import { useNoticeStore } from '../providers/RootStoreProvider'
import API from '../services/api'

export default function ActivationLinkExpired({ email }: { email: string }) {

  const [loading, setLoading] = useState(false)

  const noticeStore = useNoticeStore()

  const getActivationLink = async () => {
    try {
      setLoading(true)
      const response = await API.getActivationLink(email)
      noticeStore.setNotice(response.message)
    } catch (error) {
      console.log({ error })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <h1>Activation link expired. For a new activation link click here.</h1>
      <Button
        onClick={getActivationLink}
        fullWidth
        color="secondary"
        size="normal"
        type="submit"
        loading={loading}
      >
        Get activation link
        </Button>
    </>
  );
};