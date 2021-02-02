import {
  makeStyles,
  Grid,
  Theme,
} from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router'

import Profiles from "../../components/Chat/Profiles";
import { MainLayout } from "../../components/MainLayout";
import { withAuthServerSideProps } from '../../hocs/withAuthServerSideProps';
import { useProfileStore } from '../../providers/RootStoreProvider';

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
  }
}));

const ChatPage = observer(function ChatPage() {
  const classes = useStyles();
  const router = useRouter()

  const { profiles, profile } = useProfileStore();

  const openChatWindow = async (recipientId: number) => {

    const userIds = [profile!.userId, recipientId]
    const oneToOneKey = userIds.sort().join('-')

    router.push(`chat/${oneToOneKey}`)
  }

  return (
    <MainLayout title='Chat'>
      <Grid container>
        <Grid item sm={10} className={classes.chat}>
          <h1>CHAT</h1>
        </Grid>
        <Grid item sm={2}>
          <Profiles openChatWindow={openChatWindow} profiles={profiles ? profiles : []} />
        </Grid>
      </Grid>
    </MainLayout>
  )
})

const getProfiles = async (ctx: any) => {
  const cookie = ctx.req.headers.cookie
  const response = await fetch(`http://localhost:5000/profiles`, { headers: { cookie: cookie! } })
  const { profiles } = await response.json()

  return { profiles }
}

export default ChatPage
export const getServerSideProps: GetServerSideProps = withAuthServerSideProps(getProfiles);
