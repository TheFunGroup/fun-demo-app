import { useEffect, useState, useRef } from "react";
import Image from 'next/image';
import { ethers } from "ethers";
import Spinner from "../misc/Spinner";
import { useFun } from "../../contexts/funContext";
import { Web3AuthEoa } from "/Users/jamesrezendes/Code/fun-wallet-sdk/auth";
import { useFaucet, createFunWallet  } from "../../scripts/wallet";
import { useAccount } from 'wagmi'

export default function LinkAccounts(props) {

  const {
    connect, connectors, web3auth, setWallet, linked,
    setLinked, linkingWallet, provider, socials, magic,
    connecting, setConnecting
  } = props;
  const [showEOA, setShowEOA] = useState(false);
  // const [connecting, setConnecting] = useState();
  const { setLoading, setEOA } = useFun()
  const { connector } = useAccount()

  useEffect(() => {
    const linkConnector = async () => {
      setConnecting(connector.name)
      setLoading(true)
      let provider = await connector?.getProvider()
      const chainId = await connector.getChainId();
      if(chainId !== 5) await connector.switchChain(5)
      provider = await connector?.getProvider();
      if(!linked[connector.name]){
        const eoaAddr = await connector.getAccount()
        linked[connector.name] = `${connector.name}###${eoaAddr}`;
        setLinked(linked)
      }
      setConnecting("")
      console.log("connection false")
      setLoading(false)
    }
    if(connector && !linked[connector.name]) {
      linkConnector();
    } else if(connecting == connector?.name){
      setConnecting("")
    }
  }, [connector])

  useEffect(() => {
    console.log(linked)
  },[linked])

  async function linkMagic(oauthProvider) {
    try {
      setConnecting(oauthProvider);
      setLoading(true)
      localStorage.setItem("magic-connecting", oauthProvider)
      localStorage.setItem("magic-linking", oauthProvider)
      localStorage.setItem("linked", JSON.stringify(linked))
      await magic.oauth.loginWithRedirect({
        provider: oauthProvider,
        redirectURI: new URL('/connect', window.location.origin).href
      });
    } catch (err) {
      console.log("connect wallet connect error", err)
    }
  }

  async function createWallet(){
    setLoading(true);
    let wallet = linkingWallet;
    try {
      if(!wallet){
        const auth = new Web3AuthEoa({ provider })
        wallet = await createFunWallet(auth, provider)
        setEOA(auth)
      }
      const addr = await wallet.getAddress()
      let balance = await provider.getBalance(addr);
      balance = ethers.utils.formatEther(balance);
      if (balance == 0) {
        await useFaucet(addr, 5);
      }
    } catch(e){
      console.log(e)
    }
    localStorage.removeItem("linked")
    setWallet(wallet);
    setLoading(false);
  }

  return (
    <div className={`w-[360px] modal flex flex-col items-center text-center -mt-[136px]`} >
      <Image src="/fun.svg" width="52" height="42" alt="" />
      <div className="font-semibold text-2xl mt-6 text-[#101828]">Unlock more options for accessing your FunWallet</div>
      <div className="text-sm text-[#667085] mt-1">Add sign-in methods. Please note you can only add them during creation.</div>

      {!showEOA && (
        <div
          className="button mt-3 w-full rounded-lg border-[#D0D5DD] border-[1px] bg-[rgb(64, 153, 255)] flex justify-between cursor-pointer py-[10px] px-4"
          onClick={() => setShowEOA(true)}
        > 
          <div className="flex items-center">
            <Image src="/wallet.svg" width="22" height="22" alt="" />
            <div className="ml-3 font-medium text-[#344054]">Link to EOA</div>
          </div>
          <div></div>
        </div>
      )}

      {(showEOA && connectors.map((connector, idx) => {
        let name = connector.name;
        if(name == "WalletConnectLegacy") name = "WalletConnect"
        return (
          <button className="button mt-3 w-full rounded-lg border-[#D0D5DD] border-[1px] bg-white flex justify-between cursor-pointer py-[10px] px-4"
            disabled={!connector.ready}
            onClick={() => {
              connect({connector})
            }}
            key={idx}
          > 
            <div className="flex items-center">
              {connecting == connector.name ? (
                <Spinner />
              ) : (
                <Image src="/wallet.svg" width="22" height="22" alt="" />
              )}
              <div className="ml-3 font-medium text-[#344054]">{name}</div>
            </div>
            {linked[connector.name] && (
              <Image src="/checkbox.svg" width="22" height="22" alt="" />
            )} 
         </button>
        )
      }))}

      {Object.keys(socials).map((key) => {
        const social = socials[key]
        return (
          <button className="button mt-3 w-full rounded-lg border-[#D0D5DD] border-[1px] bg-white flex justify-between cursor-pointer py-[10px] px-4"
            onClick={() => {
              linkMagic(key)
            }}
            key={key}
          > 
            <div className="flex items-center">
              {connecting == key ? (
                <Spinner />
              ) : (
                <Image src={social.icon} width="22" height="22" alt="" />
              )}
              <div className="ml-3 font-medium text-[#344054]">{`Link to ${social.name}`}</div>
            </div>
            {linked[key] && (
              <Image src="/checkbox.svg" width="22" height="22" alt="" />
            )} 
         </button>
        )
      })}


      
      {/* <div className="w-full px-2 mt-1">
        {Object.keys(socials).map((key, idx) => {
          const social = socials[key];
          return (
            <div className={`flex items-center px-2 mt-2 ${!linked[key] && "opacity-30"}`}>
              <Image src={social.icon} width="16" height="16" alt="" />
              <div className="text-[#667085] text-sm ml-2">{`Linked to ${social.name}`}</div>
            </div>
          )
        })}
      </div> */}
      
      <div onClick={createWallet} className="text-center cursor-pointer text-[#344054] font-medium mt-8">Skip</div>

    </div>
  )
}