import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) =>{
    
    axios.defaults.withCredentials = true;
    
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [isLoggedin, setIsLoggedin] = useState(  localStorage.getItem('login') ?  JSON.parse(localStorage.getItem('login')) : false);
    const [userData, setUserData] = useState(false);

    const getAuthState = async () =>{
        try{
            axios.defaults.withCredentials=true;
            const {data} = await axios.get(backendUrl+'/api/auth/is-auth')
            if(data.success){
                setIsLoggedin(true)
                getUserData();
            }
        } catch(error){
            toast.error(error.message);
        }
    }

    const getUserData = async () => {
        try{
          axios.defaults.withCredentials=true;
          const {data} = await axios.get(backendUrl+'/api/user/data')
          data.success ? setUserData(data.userData) : toast.error(data.message)
        } catch(error){
           toast.error(error.message);
        }
    }

    useEffect( ()=>{
      getAuthState();
    }, [backendUrl])

    const value ={
        backendUrl,
        isLoggedin, setIsLoggedin,
        userData, setUserData,
        getUserData
    }

    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}
