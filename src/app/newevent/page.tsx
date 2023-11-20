'use client'
import Message from '@/components/elements/Message';
import LeagueAddUpdate from '@/components/league/LeagueAddUpdate'
import { IError } from '@/types';
import React, { useState } from 'react'

const EventNewPage = () => {
  const [actErr, setActErr] = useState<IError | null>(null);
  return (
    <div className='container mx-auto px-2'>
      <h1>Event New</h1>
      {actErr && <Message error={actErr} />}
      <LeagueAddUpdate update={false} setActErr={setActErr} />
    </div>
  )
}

export default EventNewPage