'use client'

import { GET_PLAYERS } from '@/graphql/players';
import { IPlayer } from '@/types/player';
import PlayerAdd from '@/components/player/PlayerAdd';
import PlayerList from '@/components/player/PlayerList';
import { gql, useApolloClient, useQuery } from '@apollo/client';
import React, { useState } from 'react';
import Loader from '@/components/elements/Loader';
import Message from '@/components/elements/Message';

function PlayersPage({ params }: { params: { eventId: string } }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { data, loading, error } = useQuery(GET_PLAYERS, { variables: { eventId: params.eventId } });

  if (loading || isLoading) return <Loader />;

  return (
    <div className='contaimer mx-auto px-2'>
      <h1 className="text-red-500">Read all instractions regarding creating player</h1>
      <h1 className="text-red-500">Model the database according to the instructions</h1>
      <h1 className="text-red-500">Do no follow  existing model</h1>

      <h1>Players</h1>
      {error && <Message error={error} />}
      <p>List of players of the event</p>
      <p>Add Player</p>
      <p>Update player</p>
      <PlayerAdd setIsLoading={setIsLoading} eventId={params.eventId} />
      <PlayerList playerList={data?.getPlayers?.data ? data.getPlayers.data : []} eventId={params.eventId} />
    </div>
  )
}

export default PlayersPage;