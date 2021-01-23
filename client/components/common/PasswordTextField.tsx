import { useState } from 'react'
import { useField } from 'formik'
import { TextField, InputAdornment, IconButton } from '@material-ui/core'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { Visibility, VisibilityOff } from '@material-ui/icons'

const useStyles = makeStyles((theme: Theme) => ({
  notchedOutline: {
    borderWidth: 2
  },
  label: {
    color: theme.palette.primary.light,
  },
  input: {
    color: theme.palette.primary.light,
  },
}))

interface PasswordTextFieldProps {
  label: string
  name: string
  placeholder: string
}

export default function PasswordTextField(props: PasswordTextFieldProps) {
  const classes = useStyles()
  const [field, meta] = useField(props)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  const handleShowPassword = () => {
    setIsPasswordVisible(!isPasswordVisible)
  }

  return (
    <TextField
      type={isPasswordVisible ? 'text' : 'password'}
      color="primary"
      InputLabelProps={{
        shrink: true,
        classes: {
          root: classes.label
        }
      }}
      InputProps={{
        classes: {
          notchedOutline: classes.notchedOutline,
          input: classes.input
        },
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={handleShowPassword}
            >
              {isPasswordVisible ? <Visibility /> : <VisibilityOff />}
            </IconButton>

          </InputAdornment>
        )
      }}
      variant="outlined"
      helperText={meta.touched && meta.error}
      error={meta.touched && !!meta.error}
      {...field}
      {...props}
    />
  )
}
