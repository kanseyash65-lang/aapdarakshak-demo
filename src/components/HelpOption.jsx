import { MicrophoneIcon, PencilIcon } from '@heroicons/react/24/solid'
import React from 'react'

const HelpOption = () => {
  return (
    <div className='flex items-center justify-center gap-10 mt-20'>
        <div className='gap-1 flex flex-col items-center bg-white/10 backdrop-blur-sm rounded-2xl p-5 w-32 text-center cursor-pointer border border-white/5 hover:bg-white/20 transition-all duration-300 hover:-translate-y-1 shadow-lg'>
          <MicrophoneIcon className='h-12 w-12'/>
          <p className='text-white font-bold'>Record Voice</p>
        </div>
        <div className='gap-1 flex flex-col items-center bg-white/10 backdrop-blur-sm rounded-2xl p-5 w-32 text-center cursor-pointer border border-white/5 hover:bg-white/20 transition-all duration-300 hover:-translate-y-1 shadow-lg'>
          <PencilIcon className='h-12 w-12'/>
          <p className='text-white font-bold'>Type Emergancy</p>
        </div>
    </div>
  )
}

export default HelpOption