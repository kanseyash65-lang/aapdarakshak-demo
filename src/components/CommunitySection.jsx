import { HandRaisedIcon, HeartIcon, HomeIcon, PlusCircleIcon } from '@heroicons/react/24/solid'
import React from 'react'

const CommunitySection = ({user, onHelpRequest}) => {
  

    const handleLoginClick = ()=>{
        onHelpRequest();
    }

    const handleHelpRequest =()=>{
        onHelpRequest();
    }

    const communityItems = [
        {icon: HeartIcon, text: 'Medical fundraising'},
        {icon: HomeIcon, text: 'Family crisis support'},
        {icon: HandRaisedIcon, text: 'Essential needs help'},
        {icon: PlusCircleIcon, text: 'Othernsupport requests'}
    ]
  
    return (
    <div className='bg-grey-800/80 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/10 relative overflow-hidden'>
        <div className='flex items-center absolute -inset-24 bg-blue-500/10'></div>

        <div className='relative z-10 w-[320px] flex flex-col ml-5'>
            <h2 className='text-5xl font-bold text-center mb-4 uppercase tracking-wide text-white'>community support</h2>
            <p className='text-xl text-blue-100 text-center mb-8 text-sm leading-relaxed'>Request non-emergancy assistance with verified community support</p>

            <div className='space-y-4 mb-8'>
                {communityItems.map((item, index)=>(
                    <div key={index} className='flex items-center text-blue-100'>
                    <item.icon className='w-6 h-6 text-blue-400 mr-4'/>
                    <span className='text-sm'>{item.text}</span>
                </div>
                ))}
            </div>

            <button
            onClick={handleLoginClick}
            className='w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold py-4 px-6 rounded-2xl shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 uppercase tracking-wide text-sm'>  {user ? "Request Help" : "Login to Request Help"}
</button>
        </div>
    </div>
  )
}

export default CommunitySection