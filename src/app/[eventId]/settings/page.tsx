'use client'

import React, { useState } from 'react';
import Message from '@/components/elements/Message';
import LeagueAddUpdate from '@/components/event/LeagueAddUpdate';
import { IError } from '@/types';
import { useQuery } from '@apollo/client';
import { GET_A_LEAGUE } from '@/graphql/league';
import Loader from '@/components/elements/Loader';

const SettingsPage = ({ params }: { params: { eventId: string } }) => {
  const [actErr, setActErr] = useState<IError | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  /**
   * Read query from cache or fetch data from server
   */
  const { data, loading, error } = useQuery(GET_A_LEAGUE, { variables: { eventId: params.eventId } });

  if (loading) return <Loader />
  const prevLeague = data?.getLeague?.data;

  console.log(prevLeague);
  


  return (
    <div className='container mx-auto px-2'>
      <h1>Update Event</h1>
      {error && <Message error={error} />}
      {actErr && <Message error={actErr} />}
      <LeagueAddUpdate update setIsLoading={setIsLoading} setActErr={setActErr} prevLeague={prevLeague} />
    </div>
  )
}

export default SettingsPage;