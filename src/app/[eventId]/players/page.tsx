'use client'

import PlayerAdd from '@/components/player/PlayerAdd';
import PlayerList from '@/components/player/PlayerList';
import { gql, useApolloClient } from '@apollo/client';
import React from 'react';

function PlayersPage({params}: {params: {eventId: string}}) {

  console.log(params.eventId);
  
  return (
    <div className='contaimer mx-auto px-2'>
      <h1 className="text-red-500">Read all instractions regarding creating player</h1>
      <h1 className="text-red-500">Model the database according to the instructions</h1>
      <h1 className="text-red-500">Do no follow  existing model</h1>

      <h1>Players</h1>
      <p>List of players of the event</p>
      <p>Add Player</p>
      <p>Update player</p>
      <PlayerAdd eventId={params.eventId} />
      <PlayerList eventId={params.eventId} />
    </div>
  )
}

export default PlayersPage;