import { makeStyles, Theme } from '@material-ui/core';
import { useState } from 'react'

const useStyles = makeStyles((theme: Theme) => ({
  title: {
    ...theme.typography.subtitle1,
    color: theme.palette.primary.light,
    textAlign: 'center'
  },
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
  { id: 3, firstName: 'Bzden', lastName: 'Knife', gender: 'X' },
]

export default function Profiles() {
  const classes = useStyles();

  const [isChatOpen, setIsChatOpen] = useState(false)

  const openChat = () => {

  }

  const renderProfiles = (profiles: Profile[]) => profiles.map(({ id, firstName, lastName, gender }: Profile) => (

    <div key={id} onClick={openChat}>
      <p>{firstName} {lastName}</p>
      {gender && <p>{gender}</p>}
    </div>
  ));

  return (
    <div>
      {renderProfiles(profiles)}
    </div>
  );
};