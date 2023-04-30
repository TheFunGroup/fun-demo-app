import React, { createContext, useState, useContext, useEffect } from 'react'
import { useRouter } from 'next/router';

const FunContext = createContext();

export const FunProvider = ({ children }) => {

  const router = useRouter();
  const [eoa, setEOA] = useState();
  const [wallet, setWallet] = useState();
  const [network, setNetwork] = useState(5);
  const [deployedUrl, setDeployedUrl] = useState();
  const [minted, setMinted] = useState();
  const [loading, setLoading] = useState()
  const [paymentToken, setPaymentToken] = useState("ETH");
  const [paymentAddr, setPaymentAddr] = useState();
  const [paymasterAddress, setPaymasterAddress] = useState();
  const [connectMethod, setConnectMethod] = useState();

  useEffect(() => {
    if((!wallet || !network) && (router.pathname !== "/connect")){
      router.push('/connect');
    }
  }, [wallet, network, router.pathname])

  return (
    <FunContext.Provider value={{ 
      eoa, setEOA,
      wallet, setWallet,
      network, setNetwork,
      deployedUrl, setDeployedUrl,
      minted, setMinted,
      loading, setLoading,
      paymentToken, setPaymentToken,
      paymentAddr, setPaymentAddr,
      paymasterAddress, setPaymasterAddress,
      connectMethod, setConnectMethod
    }}>
        {children}
    </FunContext.Provider>
  )

}

export const useFun = () => useContext(FunContext)