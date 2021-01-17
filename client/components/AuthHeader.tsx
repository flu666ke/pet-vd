import Image from 'next/image'
import Link from 'next/link'
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    minHeight: 64,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 2px 4px 0 #c5ced8',
    padding: '7px 70px'
  },
  logo: {
    display: 'block',
    textDecoration: 'none',

    '& img': {
      display: 'block',
      maxHeight: 50
    }
  },
  linksList: {
    display: 'flex',
    listStyleType: 'none',
    margin: 0,
    padding: 0
  },
  linksItem: {

    '&:not(:last-child)': {
      marginRight: 100
    }
  },
  link: {
    // ...theme.typography.menu,
    color: theme.palette.primary.light,
    textTransform: 'uppercase',
    textDecoration: 'none'
  }
}));


export default function AuthHeader({ menuLinks }: any) {
  const classes = useStyles();

  const linksList = menuLinks.map((link: any) => (
    <li key={link.to} className={classes.linksItem}>
      <Link href={link.to}>
        <a className={classes.link}>{link.text}</a>
      </Link>
    </li>
  ));

  return (
    <header className={classes.root}>
      <Link href="/home">
        <a>
          <Image
            src="/logo.png"
            alt="logo"
            width={90}
            height={60}
          />
        </a>
      </Link>

      <ul className={classes.linksList}>{linksList}</ul>
    </header>
  );
};
