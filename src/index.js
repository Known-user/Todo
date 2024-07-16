import React, { createContext, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

export const Context = createContext({isAuthenticated:false});
export const server = "https://todobackend-jp2h.onrender.com/api/v1";

const Appprovider=()=>{
  const [isAuthenticated,setIsAuthenticated]= useState(false);
  const [loading,setLoading]= useState(false);
  const [user,setUser]= useState("");

  return(
    <Context.Provider value={{isAuthenticated,setIsAuthenticated,loading,setLoading,user,setUser}}>
      <App />
    </Context.Provider>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Appprovider />
  </React.StrictMode>
);

reportWebVitals();
