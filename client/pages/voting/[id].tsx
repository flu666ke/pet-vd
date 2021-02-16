import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router'
import { CircularProgress, Grid, IconButton, makeStyles, TextField, Theme } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { observer } from 'mobx-react-lite';
import { v4 as uuidv4 } from 'uuid'

import { MainLayout } from '../../components/MainLayout';
import Button from '../../components/common/Button';
import { withAuthServerSideProps } from '../../hocs/withAuthServerSideProps';
import { useChatStore, useProfileStore } from '../../providers/RootStoreProvider';
import API from '../../services/api';
import socket from '../../services/socketio';
import Message from '../../components/Chat/Message';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: 500,
    margin: 40,
    backgroundColor: theme.palette.background.default,
  }
}));

const Voting = observer(function Voting() {
  const classes = useStyles();
  const router = useRouter()

  return (
    <MainLayout title='Voting'>
      <h1>Voting</h1>
    </MainLayout>
  )
})

export default Voting
export const getServerSideProps: GetServerSideProps = withAuthServerSideProps();