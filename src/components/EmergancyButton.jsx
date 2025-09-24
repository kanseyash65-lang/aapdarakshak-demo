import { BellIcon } from '@heroicons/react/24/solid'
import React from 'react'

const EmergancyButton = ({onClick}) => {
  return (
    <div className='flex justify-center'>
        <button
        onClick={onClick} 
        className='relative w-36 h-36 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex flex-col items-center justify-center text-white font-bold shadow-2xl shadow-red-500/30 hover:shadow-red-500/50 transition-all duration-300 hover:scale-105 active:scale-95 group'>
           <div className='absolute inset-0 border-4 border-white/30 rounded-full animate-ping'></div>
           <div className='absolute inset-0 border-4 border-white/20 rounded-full animate-pulse'></div>

           <BellIcon className='h-10 w-10 mb-2 transform group-hover:scale-110 transition-transform'/>
           <span className='text-xl tracking-wide'>SOS ALERT</span>
        </button>
    </div>
  )
}

export default EmergancyButton