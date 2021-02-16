import {
  makeStyles,
  Grid,
  Theme,
} from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import { GetServerSideProps } from 'next';
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react';

import Profiles from "../../components/Chat/Profiles";
import { MainLayout } from "../../components/MainLayout";
import CreatedVoting from '../../components/Voting/CreatedVoting';
import { withAuthServerSideProps } from '../../hocs/withAuthServerSideProps';
import { useProfileStore, useVotingStore } from '../../providers/RootStoreProvider';

const useStyles = makeStyles((theme: Theme) => ({
  chat: {
    marginTop: 10
  },
  loader: {
    height: 'calc(100vh - 64px)',
    background: theme.palette.background.default,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  link: {
    ...theme.typography.subtitle2,
    color: theme.palette.primary.light,
    textTransform: 'uppercase',
    textDecoration: 'none'
  },
}));

const VotingPage = observer(function VotingPage() {
  const classes = useStyles();
  const router = useRouter()

  const { allVoting } = useVotingStore();

  console.log({ allVoting })

  const openVoting = async (creatorId: number) => {

    router.push(`chat/${creatorId}`)
  }

  return (
    <MainLayout title='Voting'>
      <Grid container>
        <Grid item sm={10} className={classes.chat}>
          <h1>VOTING</h1>
          <Link href={'/voting/create'}>
            <a className={classes.link}>{'Create Voting'}</a>
          </Link>
        </Grid>
        <Grid item sm={2}>
          <CreatedVoting openVoting={openVoting} allVoting={allVoting ? allVoting : []} />
        </Grid>
      </Grid>
    </MainLayout>
  )
})

const getAllVoting = async (ctx: any) => {
  const cookie = ctx.req.headers.cookie
  const response = await fetch(`http://localhost:5000/voting`, { headers: { cookie: cookie! } })
  const { allVoting } = await response.json()

  return { allVoting }
}

export default VotingPage
export const getServerSideProps: GetServerSideProps = withAuthServerSideProps(getAllVoting);
