import { useState } from 'react'
import Button from '../components/common/Button'
import API from '../services/api'

export default function ActivationLinkExpired({ email }: any) {
  // const classes = useStyles();

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState('')
  const [message, setMessage] = useState('')

  const getActivationLink = async () => {

    try {
      setLoading(true)

      const response = await API.getActivationLink(email)
      console.log({ response })

      setMessage(response.message)
      setErrors('')

    } catch (error) {
      setErrors(error.response.data)

      console.log({ errors })
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

      {message && <div>Check your email.</div>}
    </>
  );
};