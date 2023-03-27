import React, { createContext, useState, useContext, useEffect } from 'react'
import { useRouter } from 'next/router';

const FunContext = createContext();

export const FunProvider = ({ children }) => {

  const router = useRouter();
  const [eoa, setEOA] = useState();
  const [wallet, setWallet] = useState();
  const [network, setNetwork] = useState();
  const [deployedUrl, setDeployedUrl] = useState();

  useEffect(() => {
    if(!wallet || !network){
      router.push('/connect');
    }
  }, [wallet, network])

  return (
    <FunContext.Provider value={{ eoa, setEOA, wallet, setWallet, network, setNetwork, deployedUrl, setDeployedUrl }}>
        {children}
    </FunContext.Provider>
  )

}

export const useFun = () => useContext(FunContext)