'use client'

import DirectorAdd from '@/components/director/DirectorAdd';
import React from 'react';

function DirectorPage() {
    /**
     * Show list of directors
     */
  return (
    <div className='container mx-auto px-2'>
        <h1 className="text-2xl">Directors</h1>
        <DirectorAdd />
    </div>
  )
}

export default DirectorPage;