import React from 'react'
import Navbar from '../components/Navbar'
import Header from '../components/Header'

const Home = () => {
  return (
    <div className=' w-[100vw] h-[100vh] flex flex-col items-center'>
        <Navbar/>
        <Header/>
    </div>
  )
}

export default Home