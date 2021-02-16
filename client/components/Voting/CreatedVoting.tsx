import { Card, CardContent, makeStyles, Theme, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  title: {
    ...theme.typography.subtitle1,
    color: theme.palette.primary.light,
    textAlign: 'center'
  },
  profileBlock: {
    margin: 15,
    padding: 10,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.light,
    cursor: 'pointer',
    // "&:hover": {
    //   background: theme.palette.primary.light,
    //   color: theme.palette.primary.main,
    // },
    '&:first-child': {
      marginTop: 40
    }
  },
  button: {
    backgroundColor: theme.palette.secondary.main
  }
}));

// interface Profile {
//   userId: number
//   firstName: string
//   lastName: string
//   gender?: string
// }

interface CreatedVotingProps {
  openVoting: (id: number) => void
  allVoting: any[]
}

export default function CreatedVoting({ openVoting, allVoting }: CreatedVotingProps) {
  const classes = useStyles();

  const renderProfiles = (allVoting: any[]) => allVoting.map(({ id, title, expirationDate }: any) => (
    <Card raised className={classes.profileBlock} key={id} onClick={() => openVoting(id)}>
      <CardContent>
        <Typography className={classes.title}>
          {title}
        </Typography>

        <Typography className={classes.title}>
          {expirationDate}
        </Typography>
      </CardContent>
    </Card>
  ));

  return (
    <>
      {renderProfiles(allVoting)}
    </>
  );
};