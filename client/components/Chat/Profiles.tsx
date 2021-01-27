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

interface Profile {
  id: number
  firstName: string
  lastName: string
  gender: string
}

const profiles = [
  { id: 1, firstName: 'Den', lastName: 'Korn', gender: 'X' },
  { id: 2, firstName: 'Ann', lastName: 'Rope', gender: 'X' },
  { id: 3, firstName: 'Bill', lastName: 'Knife', gender: 'X' },
]

export default function Profiles({ openChatWindow }: any) {
  const classes = useStyles();

  const renderProfiles = (profiles: Profile[]) => profiles.map(({ id, firstName, lastName, gender }: Profile) => (
    <Card raised className={classes.profileBlock} key={id} onClick={openChatWindow}>
      <CardContent>
        <Typography className={classes.title}>
          {firstName} {lastName}
        </Typography>
        {gender &&
          <Typography className={classes.title}>
            {gender}
          </Typography>}
      </CardContent>
    </Card>
  ));

  return (
    <>
      {renderProfiles(profiles)}
    </>
  );
};