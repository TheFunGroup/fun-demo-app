import { useEffect, useState, useRef } from "react";
import Image from 'next/image';
import { ethers } from "ethers";
import { createFunWallet, useFaucet } from "../../scripts/wallet";
import Spinner from "../misc/Spinner";
import { useFun } from "../../contexts/funContext";
import { Web3AuthEoa, Eoa } from "/Users/jamesrezendes/Code/fun-wallet-sdk/auth";
import { useAccount, useProvider, useConnect, useSigner } from 'wagmi'
import web3AuthClient from "../../scripts/web3auth";

export default function ConnectWallet(props) {
  const { connect, connectors } = useConnect()
  const { connector } = useAccount()
  const { data: signer } = useSigner()
  const wagmiProvider = useProvider()
  const [web3auth, setWeb3auth] = useState()
  const { setWallet, network, setNetwork, setEOA, setLoading, setConnectMethod } = useFun()
  const [connecting, setConnecting] = useState()

  useEffect(() => {
    const init = async () => {
      try {
        const web3Auth = await web3AuthClient(network)
        setWeb3auth(web3Auth);
      } catch(e){
        console.log("Connect Wallet Init error", e)
      }
    }
    init()
  }, [])

  useEffect(() => {
    const connectFunWallet = async () => {
      let provider = await connector?.getProvider()
      if (signer && provider) {
        const chainId = await connector.getChainId();
        if(chainId !== 5) await connector.switchChain(5)
        setNetwork(5)
        provider = await connector?.getProvider();
        const auth = new Eoa({ signer: signer, provider: provider })
        setConnecting(connector.name)
        setLoading(true)
        const FunWallet = await createFunWallet(auth)
        const addr = await FunWallet.getAddress()
        FunWallet.address = addr
        try {
          const code = await wagmiProvider.getCode(addr);
          FunWallet.deployed = true
        } catch (e) {
          FunWallet.deployed = false
        }
        try {
          let balance = await wagmiProvider.getBalance(addr);
          balance = ethers.utils.formatEther(balance);
          if (balance == 0) {
            await useFaucet(addr, 5);
          }
        } catch(e){
          console.log(e)
        }
        setConnectMethod("wagmi");
        setEOA(auth);
        setWallet(FunWallet);
        setConnecting("")
        setLoading(false)
      }
    }

    connectFunWallet()
  }, [signer, wagmiProvider])

  async function connectWeb3Auth() {
    try {
      const web3authProvider = await web3auth.connect()
      setConnecting("web3Auth")
      setLoading(true)
      setNetwork(5)
      const provider = new ethers.providers.Web3Provider(web3authProvider)
      if (provider) {
        const auth = new Web3AuthEoa({ provider })
        const FunWallet = await createFunWallet(auth)
        const addr = await FunWallet.getAddress();
        FunWallet.address = addr;
        try {
          const code = await provider.getCode(addr);
          FunWallet.deployed = true
        } catch (e) {
          FunWallet.deployed = false
        }
        let balance = await provider.getBalance(addr);
        balance = ethers.utils.formatEther(balance);
        if (balance == 0) {
          await useFaucet(addr, 5);
        }
        setConnectMethod("web3Auth");
        setEOA(auth);
        setWallet(FunWallet);
        setLoading(false)
      }

    } catch (err) {
      console.log("connect wallet connect error", err)
    }
  }

  return (
    <div className={`w-[360px] modal flex flex-col items-center text-center -mt-[64px]`} >
      <Image src="/fun.svg" width="52" height="42" alt="" />
      <div className="font-semibold text-2xl mt-6 text-[#101828]">Let the Fun begin</div>
      <div className="text-sm text-[#667085] mt-1">Unlock the power of Fun Wallets.</div>

      {connectors.map((connector, idx) => {
        return (
          <button className="button mt-3 w-full rounded-lg border-[#D0D5DD] border-[1px] bg-white flex justify-center cursor-pointer py-[10px] px-4"
            disabled={!connector.ready}
            onClick={() => {
              connect({connector})
            }}
            key={idx}
          >
             {connecting == connector.name ? (
               <Spinner />
             ) : (
               <Image src="/wallet.svg" width="22" height="22" alt="" />
             )}
           <div className="ml-3 font-medium text-[#344054]">{connector.name}</div>
         </button>
        )
      })}

      <div
        className="button mt-3 w-full rounded-lg border-[#D0D5DD] border-[1px] bg-[rgb(64, 153, 255)] flex justify-center cursor-pointer py-[10px] px-4"
        onClick={connectWeb3Auth}
      >
        {connecting == "web3Auth" ? (
          <Spinner />
        ) : (
          <Image src="/wallet.svg" width="22" height="22" alt="" />
        )}
        <div className="ml-3 font-medium text-[#344054]">Connect Web3Auth</div>
      </div>

    </div>
  )
}

export async function getStaticProps() {
  return {
    props: {
      API_KEY: process.env.API_KEY
    }
  }
}