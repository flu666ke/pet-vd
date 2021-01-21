import Link from 'next/link'
import { makeStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  error: {
    color: theme.palette.error.main,
    padding: 20
  },
  link: {
    color: theme.palette.primary.light,
    padding: 20,
    "& a": {
      color: theme.palette.primary.light,
      textTransform: 'uppercase',
    },
  },
}));

export default function ErrorPage() {
  const classes = useStyles();

  return (
    <>
      <h1 className={classes.error}>Error 404</h1>
      <p className={classes.link}>Please <Link href='/'><a>go back</a></Link></p>
    </>
  )
}