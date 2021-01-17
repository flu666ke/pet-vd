// import Link from 'next/link'
import { useState } from 'react'
import Button from '../../components/common/Button'
import { MainLayout } from '../../components/MainLayout'
import API from '../../services/api'

export default function ActivationLinkExpired() {
  // const classes = useStyles();

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState('')
  const [message, setMessage] = useState('')

  const result = true

  const getActivationLink = async () => {
    console.log('getActivationLink')

    try {
      setLoading(true)

      const response = await API.getActivationLink()
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
    <MainLayout message={message} errors={errors}>
      <h1>Activation link expired. For a new activation link click here.</h1>
      <Button
        onClick={getActivationLink}
        fullWidth
        color="secondary"
        size="normal"
        type="submit"
        loading={false}
      >
        Get activation link
        </Button>

      {result && <div>Check your email.</div>}
    </MainLayout>
  );
};