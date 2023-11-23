import { GET_PLAYERS } from '@/graphql/players';
import { IPlayer } from '@/types/player';
import { useQuery } from '@apollo/client';
import React from 'react';
import PlayerCard from './PlayerCard';

function PlayerList({ eventId }: { eventId: string }) {

  const { data, loading, error } = useQuery(GET_PLAYERS, { variables: { eventId } });
  console.log({data});

  return (
    <div>
      <h1>Players List</h1>
      <ul className='flex flex-wrap items-center'>
        {data?.getPlayers?.data && data?.getPlayers?.data.map((player: IPlayer)=><PlayerCard key={player._id} player={player} />)}
      </ul>
    </div>
  )
}

export default PlayerList;