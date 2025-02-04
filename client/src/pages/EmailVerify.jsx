import axios from 'axios';
import React, { useContext, useEffect, useRef } from 'react'
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const EmailVerify = () => {

  axios.defaults.withCredentials = true;

  const navigate = useNavigate();

  const {backendUrl, isLoggedin, getUserData, userData} = useContext(AppContext);

  const inputRefs = useRef([]);

  const inputHandler = (e, index) =>{
    if(e.target.value.length > 0 && index < inputRefs.current.length-1){
      inputRefs.current[index+1].focus();
    }
  }

  const handleKeyDown = (e, index) =>{
    if( e.key == 'Backspace' && e.target.value === '' && index>0){
      inputRefs.current[index-1].focus();
    }
  }

  const handlePaste = (e) =>{
    const paste = e.clipboardData.getData('text');
    const pasteArray = paste.split('');

    pasteArray.forEach( (char, index) => {
       if(inputRefs.current[index]){
        inputRefs.current[index].value=char;
       }
    });
  }

  const submitHandler = async (e) =>{
    try{
       
      e.preventDefault();

      const optArray = inputRefs.current.map( e => e.value );
      const otp = optArray.join('');

      const {data} = await axios.post(backendUrl+'/api/auth/verify-account', {otp});

      if(data.success){
        toast.success(data.message);
        getUserData();
        navigate('/')
      }
      else{
        toast.error(data.message);
      }

    } catch(error){
       toast.error(error.message);
    }
  }

  useEffect( ()=>{
     isLoggedin && userData && userData.isAccountVerified && navigate('/');
  }, [isLoggedin, userData])

  return (
    <div className=' w-1[100vw] h-[100vh] bg-gradient-to-br from-blue-200 to bg-purple-400 text-white flex justify-center items-center'>

       <form onSubmit={submitHandler}>
          <div className=' w-96 h-auto flex flex-col items-center rounded-lg bg-slate-900 p-10'>
            <h1 className=' text-3xl font-semibold'>Email verification otp</h1>
            <p className=' text-[12px] mt-2 text-blue-300'>Enter the 6 digit code sent to your email id</p>
   
            <div onPaste={handlePaste} className=' flex justify-between gap-2 mt-4'>
               {Array(6).fill(0).map( (_, index)=>(
                 <input 
                 ref={ (e) => inputRefs.current[index] = e }
                 onInput={ (e) => inputHandler(e, index) }
                 onKeyDown={ (e) => handleKeyDown(e, index) }
                 type='text' key={index} maxLength='1' required
                 className=' w-12 h-12 bg-[#333A5C] outline-none text-white text-xl rounded-md text-center'
                 />
               ))}
            </div>
            <button className=' py-2 px-10 rounded-md bg-blue-700 font-semibold hover:scale-[0.98] transition-all duration-100 mt-8'>Verify email</button>
          </div>
       </form>

    </div>
  )
}

export default EmailVerify