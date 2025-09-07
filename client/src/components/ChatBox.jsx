import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import Message from './Message'

const ChatBox = () => {

  const {selectedChat, theme} = useAppContext()

  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    if(selectedChat){
      setMessages(selectedChat.messages)
    }
  }, [selectedChat])

  return (
    <div className='flex-1 flex flex-col justify-between m-5 md:m-10 xl:mx-30 max-md:mt-14 2xl:pr-10'>
      
      {/* Chat Messages */}
      <div className='flex-1 mb-15 overflow-y-scroll'>
        {messages.length === 0 && (
          <div className='h-full flex flex-col justify-center items-center gap-2 text-primary'> 
            <img src={theme === 'dark' ? assets.logo_personal : assets.logo_personal_dark} alt="" className='w-full max-w-56 sm:max-w-68' />
            <p className='mt-5 text-4xl sm:text-6xl text-center text-gray-400 dark:text-white'>Ask me anything</p>
          </div>
        )}

        {messages.map((message, index) => <Message key={index} message={message}/>)}
      </div>
    
      {/* Prompt Input Box */}
      <form>
        <input type="text" placeholder='Type your message...' className='w-full p-4 rounded-md bg-slate-50 dark:bg-[#57317C]/30 border border-[#80609F]/30 text-sm dark:text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent' />
        <button type='submit' className='hidden'>Send</button>
      </form>
    </div>
  )
}

export default ChatBox