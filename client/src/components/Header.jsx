import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'

const Header = () => {

  const {userData} = useContext(AppContext);

  return (
    <div className=' h-auto w-full flex flex-col items-center justify-center gap-5 mt-32'>
        <h1 className=' text-2xl font-semibold'>Hello {userData ? userData.name: 'Developer'}</h1>
        <button className=' border border-gray-600 px-6 py-1 hover:bg-slate-200 rounded-full'>Get start</button>
    </div>
  )
}

export default Header