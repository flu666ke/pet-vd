import React, { ChangeEvent } from 'react'
import { useField } from 'formik'
import { TextField as MaterialTextField } from '@material-ui/core'
import { makeStyles, Theme } from '@material-ui/core/styles'

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

interface TextFieldProps {
  label: string
  name: string
  placeholder: string
  value?: string
  onChange?: (e: ChangeEvent<any>) => void
}

export default function TextField(props: TextFieldProps) {
  const classes = useStyles()
  const [field, meta] = useField(props)

  return (
    <MaterialTextField
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
