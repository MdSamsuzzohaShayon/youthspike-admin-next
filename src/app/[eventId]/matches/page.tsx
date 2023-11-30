'use client'

import MatchAdd from '@/components/match/MatchAdd'
import MatchList from '@/components/match/MatchList'
import { GET_MATCHES } from '@/graphql/matches'
import { useQuery } from '@apollo/client'
import React from 'react'

function MatchesPage({ params }: { params: { eventId: string } }) {
  // Fetch teams and players of the teams
  const { data } = useQuery(GET_MATCHES, { variables: { eventId: params.eventId } });
  const matches = data?.getMatches?.data;

  return (
    <div className="container mx-auto px-2">
      <h1>Matches</h1>
      <MatchAdd eventId={params.eventId} />
      {matches && <MatchList matches={matches} />}
    </div>
  )
}

export default MatchesPage