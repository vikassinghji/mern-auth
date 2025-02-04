import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const ResetPassword = () => {

  const {backendUrl} = useContext(AppContext);
  axios.defaults.withCredentials = true;

  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isEmailSent, setIsEmailSent] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSubmited, setIsOtpSubmited] = useState('');

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

    const onSubmitEmail = async (e) =>{
      try{
          e.preventDefault();

          const {data} = await axios.post(backendUrl+'/api/auth/send-reset-otp', {email});

          if(data.success){
            toast.success(data.message);
            setIsEmailSent(true);
          }
          else{
            toast.error(data.message);
          }
      } catch(error){
         toast.error(error.message);
      }
    }

    const onSubmitOtp = async (e) =>{
      e.preventDefault();
      const otpArray = inputRefs.current.map( e => e.value);
      setOtp(otpArray.join(''));
      setIsOtpSubmited(true);
    }

    const onSubmitNewPassword = async (e) =>{
      try{

        e.preventDefault();
        const {data} = await axios.post(backendUrl+'/api/auth/reset-password', {email, otp, newPassword});
        if(data.success){
          toast.success(data.message);
          navigate('/');
        }
        else{
          toast.error(data.message)
        }

      } catch(error){
        toast.error(error.message);
      }
    }

  return (
    <div className=' w-1[100vw] h-[100vh] bg-gradient-to-br from-blue-200 to bg-purple-400 text-white flex justify-center items-center'>

    {!isEmailSent && 
    <form onSubmit={onSubmitEmail} >
       <div className=' w-96 h-auto flex flex-col items-center rounded-lg bg-slate-900 p-10'>
         <h1 className=' text-3xl font-semibold'>Reset password</h1>
         <p className=' text-[12px] mt-2 text-blue-300'>Enter your registered email id</p>
         
         <input 
         type='email' placeholder='Enter email' value={email} required
         onChange={ (e) => setEmail(e.target.value)}
         className=' bg-[#333A5C] py-2 rounded-full px-6 mt-4 w-full outline-none'/>

         <button className=' py-2 px-10 rounded-md bg-blue-700 font-semibold hover:scale-[0.98] transition-all duration-100 mt-8'>Verify email</button>
       </div>
    </form>
  }


    {/* otp input form */}

    {isEmailSent && !isOtpSubmited && 
    <form onSubmit={onSubmitOtp}>
       <div className=' w-96 h-auto flex flex-col items-center rounded-lg bg-slate-900 p-10'>
         <h1 className=' text-3xl font-semibold'>Reset password otp</h1>
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
         <button className=' py-2 px-10 rounded-md bg-blue-700 font-semibold hover:scale-[0.98] transition-all duration-100 mt-8'>Submit</button>
       </div>
    </form>
  }


    {/* new password */}

    {isEmailSent && isOtpSubmited && 
    <form onSubmit={onSubmitNewPassword}>
       <div className=' w-96 h-auto flex flex-col items-center rounded-lg bg-slate-900 p-10'>
         <h1 className=' text-3xl font-semibold'>Reset password</h1>
         <p className=' text-[12px] mt-2 text-blue-300'>Enter your new password</p>
         
         <input 
         type='password' placeholder='Enter new password' value={newPassword} required
         onChange={ (e) => setNewPassword(e.target.value)}
         className=' bg-[#333A5C] py-2 rounded-full px-6 mt-4 w-full outline-none'/>

         <button className=' py-2 px-10 rounded-md bg-blue-700 font-semibold hover:scale-[0.98] transition-all duration-100 mt-8'>Submit</button>
       </div>
    </form>
  }


 </div>
  )
}

export default ResetPassword