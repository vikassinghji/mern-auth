import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {

  const navigate = useNavigate();

  const {backendUrl, setIsLoggedin, getUserData} = useContext(AppContext);

  const [state, setState] = useState('Sign Up');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler = async (e)=>{
      try{
          e.preventDefault();

          axios.defaults.withCredentials = true;
          
          if(state=='Sign Up'){
            const {data} = await axios.post(backendUrl+'/api/auth/register', {name, email, password});
            
            if(data.success){
              setIsLoggedin(true);
              getUserData();
              navigate('/')
            }
            else{
              toast.error(data.message);
            }
          }
          else{
            const {data} = await axios.post(backendUrl+'/api/auth/login', {email, password});

            if(data.success){
              setIsLoggedin(true);
              getUserData();
              navigate('/')
            }
            else{
              toast.error(data.message);
            }
          }
      } catch(error){
        toast.error(error.message);
      }
  }

  return (
    <div className=' w-[100vw] h-[100vh] bg-gradient-to-br from-blue-200 to bg-purple-400 text-white flex justify-center items-center'>
       
       <div className=' w-96 h-auto flex flex-col items-center rounded-lg bg-slate-900 p-10'>
        <h1 className=' text-3xl font-semibold text-center mb-2'>{state==='Sign Up' ? 'Create Account' : 'Login'}</h1>
        <p className=' text-xl font-medium text-center mb-2'>{state==='Sign Up' ? 'Create your Account' : 'Login to your account'}</p>

        <form onSubmit={onSubmitHandler}>
          {state==='Sign Up' && (
          <div>
            <input onChange={ e => setName(e.target.value)} value={name} type='text' placeholder='Full name' required className='mb-3 outline-none  p-2 px-6 rounded-full bg-slate-500'/>
          </div>
          )}

          <div>
            <input onChange={ e => setEmail(e.target.value)} value={email} type='email' placeholder='Email id' required className=' mb-3 outline-none p-2 px-6 rounded-full bg-slate-500'/>
          </div>

          <div>
            <input onChange={ e => setPassword(e.target.value)} value={password} type='password' placeholder='password' required className=' mb-3 outline-none p-2 px-6 rounded-full bg-slate-500'/>
          </div>
          <p onClick={ () =>navigate('/reset-password')} className=' text-[12px] text-blue-400 cursor-pointer'>Forgot password</p>
          <button className=' w-full py-1 mt-2 bg-indigo-500 hover:bg-indigo-700 rounded-full text-[16px] font-medium'>{state}</button>

        </form>
         {state==='Sign Up' ? 
         (
          <p onClick={ ()=>setState('Login')} className=' text-[12px] mt-2 text-gray-400'>Already have an account? <span className=' text-blue-400 underline cursor-pointer'>Login here</span></p>
         ):
         (
          <p onClick={ ()=>setState('Sign Up')} className=' text-[12px] mt-1 text-gray-400'>Don't have an account? <span className=' text-blue-400 underline cursor-pointer'>Signup</span></p>
         )
         }
       </div>
    </div>
  )
}

export default Login