'use client'
import LeagueAddUpdate from '@/components/league/LeagueAddUpdate'
import React from 'react'

const EventNewPage = () => {
  return (
    <div className='container mx-auto px-2'>
        <h1>Event New</h1>
        <LeagueAddUpdate update={false} />
    </div>
  )
}

export default EventNewPage