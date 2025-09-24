import React from 'react'
import {ShieldExclamationIcon, UserGroupIcon} from '@heroicons/react/24/solid'

const Header = ({onResponderClick}) => {
  return (
    <div className='text-center mb-8'>
        <div className='flex items-center justify-center mb-4'>
           <ShieldExclamationIcon className='h-12 w-12 text-red-500 mr-3 drop-shadow-lg'/> 
           <h1 className='text-3xl font-bold font-orbitron bg-gradient-to-r from-white to-purple-500 bg-clip-text text-transparent drop-shadow-lg'>AAPDARAKSHAK</h1>
        </div>
        <p className='text-purple-300 text-sm font-medium tracking-wide'>Community-powered emergancy response system</p>
    </div>
  )
}

export default Header