'use client'

import Message from '@/components/elements/Message';
import { GET_PLAYERS } from '@/graphql/players';
import { IPlayer } from '@/types/player';
import { useLazyQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';

interface ITeamsPageProps {
  params: { eventId: string }
}

function TeamsPage({ params }: ITeamsPageProps) {
  const [availablePlayers, setAvailablePlayers] = useState<IPlayer[]>([]);
  const [fetchPlayers, { data, error }] = useLazyQuery(GET_PLAYERS);

  useEffect(() => {
    (async () => {
      if (params.eventId) {
        const playerRes = await fetchPlayers({ variables: { eventId: params.eventId } });
        if (playerRes?.data?.getPlayers?.data) {
          const newAvailablePlayers = playerRes.data.getPlayers.data.filter((p:IPlayer) => !p.team);
          if (newAvailablePlayers.length > 0) setAvailablePlayers(newAvailablePlayers);
        }
      }
    })()
  }, []);

  return (
    <div className='container mx-auto px-2'>
      {error && <Message error={error} />}
      <p>List of teams</p>
      <p>Add New Team(Assign players to the team)</p>
      <p>Make captain</p>
    </div>
  )
}

export default TeamsPage;