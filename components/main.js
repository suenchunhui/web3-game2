import { useWeb3Auth } from "../context/web3auth";
import styles from "../styles/Home.module.css";
import { WALLET_ADAPTERS } from "@web3auth/base";       //  <span>{userAddress} </span>
import React, { useState, useEffect } from 'react'

//...



const Main = () => {
  const { provider, login, logout, user, isLoading, getAccounts, getBalance, signMessage, signTransaction, signAndSendTransaction, web3Auth, chain } = useWeb3Auth();
  const [userAddress, setUserAddress] = useState('null')
  getAccounts().then(result => setUserAddress(result))


  const loggedInView = (
    <>
      <div dir="rtl">
        <button dir="rtl" className="rounded-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
          onClick={logout} disabled={isLoading} variant="outlined">
          Log Out
        </button>
        <button disabled={isLoading} className="rounded-full inline-flex items-center h-10 px-5 text-green-100 transition-colors duration-150 bg-green-500 rounded-lg focus:shadow-outline hover:bg-green-800">
          <span>{userAddress} </span>          <svg className="w-4 h-4 ml-3 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" fill-rule="evenodd"></path></svg>
        </button>

      </div>
    </>
  );

  const unloggedInView = (


    <div dir="rtl">
      <button onClick={() => { login(); }} className="rounded-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded" disabled={isLoading} variant="outlined">
        login
      </button>
    </div>
  );

  return <div style={{
    paddingTop: '20px'
  }} >{provider ? loggedInView : unloggedInView}</div>;
};


export default Main;
