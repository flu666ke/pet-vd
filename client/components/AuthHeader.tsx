import Image from 'next/image'
import Link from 'next/link'
import { makeStyles, Theme } from '@material-ui/core';

import { useUserStore } from '../providers/RootStoreProvider';
import API from '../services/api';
import { useRouter } from 'next/router';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    minHeight: 64,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: `0 2px 4px 0 ${theme.palette.primary.light}`,
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
  },
  logoutButton: {
    color: theme.palette.primary.light,
    textTransform: 'uppercase',
    backgroundColor: theme.palette.background.default,
    border: 'none',
    outline: 'none',
    cursor: 'pointer'
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
    to: '/chat',
    text: 'chat'
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
  const router = useRouter()
  const { user, removeUser } = useUserStore()

  const logout = async () => {
    try {
      await API.logout()
      removeUser()
      router.push('/signin')
    } catch (error) {
      console.log({ error })
    }
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

      <ul className={classes.linksList}>
        {user ? privateLinksList : publicLinksList}
        {user && <button className={classes.logoutButton} onClick={logout}>Logout</button>}
      </ul>
    </header>
  );
};
