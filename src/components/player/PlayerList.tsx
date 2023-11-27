import { useQuery } from '@apollo/client';
import React from 'react';
import PlayerCard from './PlayerCard';
import { IPlayer } from '@/types/player';

function PlayerList({ playerList, eventId }: { playerList: IPlayer[], eventId: string }) {

  console.log(playerList);
  
  return (
    <div>
      <h1>Players List</h1>
      <ul className='flex flex-wrap items-center'>
        {playerList.length > 0 && playerList.map((player: IPlayer) => <PlayerCard key={player._id} player={player} />)}
      </ul>
    </div>
  )
}

export default PlayerList;