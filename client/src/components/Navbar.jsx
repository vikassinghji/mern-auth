import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Navbar = () => {

    const navigate = useNavigate();
    const {userData, backendUrl, setIsLoggedin, setUserData} = useContext(AppContext);

    const sendVerifyOtp = async () =>{
      try{
        
        axios.defaults.withCredentials = true;

        const {data} = await axios.post(backendUrl+'/api/auth/send-verify-otp');

        if(data.success){
          navigate('/email-verify');
          toast.success(data.message);
        }
        else{
          toast.error(data.message);
        }
      } catch(error){
         toast.error(error.message);
      }
    }

    const logout = async () => {
      try{
        axios.defaults.withCredentials = true;

        const {data} = await axios.post(backendUrl+'/api/auth/logout');
        data.success && setIsLoggedin(false);
        data.success && setUserData(false);
        navigate('/');
      } catch(error){
         toast.error(error.message);
      }
    }

  return (
    <div className='  w-11/12 flex justify-between py-3'>
        <div className=' font-bold text-xl'>LOGO</div>
        {userData ? 
        <div className=' group relative px-4 py-2 font-medium border border-slate-700 cursor-pointer rounded-full bg-slate-400'>
        {userData.name[0].toUpperCase()}
        <div className=' py-2 px-1 hidden group-hover:block absolute w-24 hover:flex flex-col left-0 bg-slate-200 top-[40px]'>
          <ul>
           {!userData.isAccountVerified &&  <li onClick={sendVerifyOtp} className=' hover:bg-slate-300 cursor-pointer mb-1'>Verify Email</li>}
            <li onClick={logout} className=' hover:bg-slate-300 cursor-pointer'>Logout</li>
          </ul>
        </div>
        </div> : 
        <button onClick={ ()=>navigate('/login')} className=' flex items-center justify-center  px-7 rounded-full border border-gray-600 hover:bg-slate-200'>Login</button>
        }
    </div>
  )
}

export default Navbar