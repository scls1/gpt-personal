import React from 'react'
import Sidebar from './components/Sidebar'
import ChatBox from './components/ChatBox'
import Credits from './pages/Credits'
import Community from './pages/Community'
import { Route, Routes } from 'react-router-dom'

const App = () => {
  return (
    <>
      <div className='dark:bg-gradient-to-b from-[#242124] to-[#000000] dark:text-white'>
        <div className='flex h-screen w-screen'>
          <Sidebar />
          <Routes>
            <Route path='/' element={<ChatBox />} />
            <Route path='/credits' element={<Credits />} />
            <Route path='/community' element={<Community />} />
            <Route path="*" element={<h1>404 - Not Found</h1>} />
          </Routes>
        </div>
      </div>
    </>
  )
}

export default App