import Image from 'next/image'
import Link from 'next/link'
import { makeStyles } from '@material-ui/core';

import { useUserStore } from '../providers/RootStoreProvider';

const useStyles = makeStyles(theme => ({
  root: {
    minHeight: 64,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 2px 4px 0 #c5ced8',
    padding: '7px 70px'
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
    color: theme.palette.primary.light,
    textTransform: 'uppercase',
    textDecoration: 'none'
  }
}));

const publicMenuLinks = [
  {
    to: '/signin',
    text: 'login'
  },
  {
    to: '/signup',
    text: 'register'
  }
];

const privateMenuLinks = [
  {
    to: '/',
    text: 'home'
  },
  {
    to: '/profile',
    text: 'profile'
  }
];

interface MenuItem {
  to: string,
  text: string
}

export default function AuthHeader() {
  const classes = useStyles();
  const userStore = useUserStore()

  const killCookie = () => {

    console.log('killCookie')
  }

  const createMenu = (menuLinks: MenuItem[]) => menuLinks.map((link: MenuItem) => (
    <li key={link.to} className={classes.linksItem}>
      <Link href={link.to}>
        <a className={classes.link}>{link.text}</a>
      </Link>
    </li>
  ));

  const publicLinksList = createMenu(publicMenuLinks)
  const privateLinksList = createMenu(privateMenuLinks)

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

      <ul className={classes.linksList}>{userStore.user ? privateLinksList : publicLinksList} <button onClick={killCookie}>kill cookie</button></ul>
    </header>
  );
};
