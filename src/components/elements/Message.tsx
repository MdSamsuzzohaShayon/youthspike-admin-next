import React from 'react'

const Message = ({text}: {text: string}) => {
  return (
    <div className='text-red-500'>{text}</div>
  )
}

export default Message