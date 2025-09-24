import React from 'react'
import EmergancyButton from './EmergancyButton'
import HelpOption from './HelpOption'

const EmergancySection = ({onEmergencyClick}) => {
  return (
    <div className='bg-gray-800/80 backdrop-blur-md rounded-3xl p-8 mb-8 shadow-2xl border border-white/10 relative overflow-hidden'>
        <div className='absolute -inset-24 bg-red-500/10 animate-pulse-slowctrnsform rotate-45'></div>
        <div className='relative z-10'>
            <h2 className='text-5xl font-bold text-center mb-4 uppercase tracking-wide text-white'>Emergancy Assistance</h2>
            <p className='text-red-100 text-center mb-8 text-sm leading-relaxed'>
                In immediate danger? Press the button to alert nearby responders instantly. no login requiered.
            </p>

            <EmergancyButton onClick={onEmergencyClick}/>
            <HelpOption/>
        </div>
    </div>
  )
}

export default EmergancySection