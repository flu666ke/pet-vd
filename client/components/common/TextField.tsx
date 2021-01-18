import React from 'react'
import { useField } from 'formik'
import { TextField as MaterialTextField } from '@material-ui/core'
import { makeStyles, Theme } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) => ({
  notchedOutline: {
    borderWidth: 2
  },
  label: {
    color: theme.palette.primary.light,
  }
}))

interface TextFieldProps {
  label: string
  name: string
  placeholder: string
}

export default function TextField(props: TextFieldProps) {
  const classes = useStyles()
  const [field, meta] = useField(props)

  return (
    <MaterialTextField
      color="secondary"
      InputLabelProps={{
        shrink: true,
        classes: {
          root: classes.label
        }
      }}
      InputProps={{
        classes: {
          notchedOutline: classes.notchedOutline
        }
      }}
      helperText={meta.touched && meta.error}
      error={meta.touched && !!meta.error}
      variant="outlined"
      {...field}
      {...props}
    />
  )
}