'use client'

import React, { useState } from 'react';
import Message from '@/components/elements/Message';
import EventAddUpdate from '@/components/event/EventAddUpdate';
import { IError } from '@/types';
import { useQuery } from '@apollo/client';
import { GET_A_EVENT } from '@/graphql/event';
import Loader from '@/components/elements/Loader';

const SettingsPage = ({ params }: { params: { eventId: string } }) => {
  const [actErr, setActErr] = useState<IError | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  /**
   * Read query from cache or fetch data from server
   */
  const { data, loading, error } = useQuery(GET_A_EVENT, { variables: { eventId: params.eventId } });

  if (loading || isLoading) return <Loader />
  const prevEvent = data?.getEvent?.data;


  return (
    <div className='container mx-auto px-2'>
      <h1>Update Event</h1>
      {error && <Message error={error} />}
      {actErr && <Message error={actErr} />}
      <EventAddUpdate update setIsLoading={setIsLoading} setActErr={setActErr} prevEvent={prevEvent} />
    </div>
  )
}

export default SettingsPage;