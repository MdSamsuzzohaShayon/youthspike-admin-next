'use client'

import DirectorAdd from '@/components/director/DirectorAdd';
import DirectorList from '@/components/director/DirectorList';
import React from 'react';

function DirectorPage() {
    /**
     * Show list of directors
     */
  return (
    <div className='container mx-auto px-2'>
        <h1>Directors (Only accessable by admin)</h1>
        <DirectorAdd update={false} />
        <DirectorList />
    </div>
  )
}

export default DirectorPage;