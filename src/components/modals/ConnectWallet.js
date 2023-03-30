import { useEffect, useState, useRef } from "react";
import Image from 'next/image';
import { ethers } from "ethers";
import { networks, connectToNetwork } from "../../utils/networks";
import { createFunWallet } from "../../scripts/wallet";
import Spinner from "../misc/Spinner";
import { useFun } from "../../contexts/funContext";
import Loader from "../misc/Loader";
import { Eoa, WalletConnectEoa } from "../../../../fun-wallet-sdk/auth"

import { Web3Button, useWeb3Modal } from '@web3modal/react'
import { useProvider, useConnect } from 'wagmi'

import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import WalletConnectProvider from "@walletconnect/web3-provider";

//  Create WalletConnect Provider
// const connector = new WalletConnect({
//   bridge: "https://bridge.walletconnect.org", // Required
//   qrcodeModal: QRCodeModal,
// });


export default function ConnectWallet(props) {

  const { setWallet, setNetwork, setEOA, setLoading } = useFun()
  // const { isOpen, open, close, setDefaultChain } = useWeb3Modal();
  // const { connect, connectors, error, isLoading, pendingConnector } = useConnect()
  const [creating, setCreating] = useState()
  const [wConnecting, setWConnecting] = useState()

  async function connectEOA() {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any") // any is needed if user has to change network to goerli

    await provider.send('eth_requestAccounts', []); // <- this promps user to connect metamask
    const eoa = provider.getSigner();
    localStorage.setItem("fun-wallet-addr", "")
    try {
      const auth = new Eoa({ signer: eoa })
      const network = 5
      setCreating(true)
      setLoading(true);
      connectToNetwork(network).then(async () => {
        const FunWallet = await createFunWallet(auth, network)
        const addr = await FunWallet.getAddress();
        FunWallet.address = addr;
        try {
          const code = await provider.getCode(addr);
          FunWallet.deployed = true
        } catch(e){
          FunWallet.deployed = false
        }
        let balance = await provider.getBalance(addr);
        balance = ethers.utils.formatEther(balance);
        if(balance == 0){
          await useFaucet(addr);
        }
        setEOA(auth);
        setNetwork(network)
        setWallet(FunWallet);
        setCreating(false)
        setLoading(false)
      })
    } catch (e) {
      console.log(e)
    }
  }


  const walletConnect = async () => {
    try {
      const walletConnectProvider = new WalletConnectProvider({
        rpc: {
          5: "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
        },
        qrcode: true,
      });
      //  Enable session (triggers QR Code modal)
      await walletConnectProvider.enable();
      const provider = new ethers.providers.Web3Provider(walletConnectProvider);
      const signer = provider.getSigner()
      const auth = new WalletConnectEoa({ signer, provider })
      console.log(auth)
      const network = 5
      setWConnecting(true)
      setLoading(true)
      // connectToNetwork(network).then(async () => {
      const FunWallet = await createFunWallet(auth, network)
      const addr = await FunWallet.getAddress();
      FunWallet.address = addr;
      try {
        const code = await provider.getCode(addr);
        FunWallet.deployed = true
      } catch(e){
        FunWallet.deployed = false
      }
      let balance = await provider.getBalance(addr);
      balance = ethers.utils.formatEther(balance);
      if(balance == 0){
        await useFaucet(addr);
      }
      setEOA(auth);
      setNetwork(network)
      setWallet(FunWallet);
      setWConnecting(false)
      setLoading(false)
      // })

    } catch (e) {
      console.log(e)
    }

  }

  async function useFaucet(addr){
    try {
      await fetch(`http://18.237.113.42:8001/get-faucet?token=eth&testnet=goerli&addr=${addr}`)
      await fetch(`http://18.237.113.42:8001/get-faucet?token=usdc&testnet=goerli&addr=${addr}`)
      await fetch(`http://18.237.113.42:8001/get-faucet?token=dai&testnet=goerli&addr=${addr}`)
      await fetch(`http://18.237.113.42:8001/get-faucet?token=usdt&testnet=goerli&addr=${addr}`)
      setTimeout(() => {
        return
      }, 1500)
    } catch(e){

    }
  }

  return (
    <div className={`w-[360px] modal flex flex-col items-center text-center -mt-[64px]`} >
      <Image src="/fun.svg" width="52" height="42" alt="" />
      <div className="font-semibold text-2xl mt-6 text-[#101828]">Let the Fun begin</div>
      <div className="text-sm text-[#667085] mt-1">Unlock the power of Fun Wallets.</div>
      <div
        className="button mt-8 w-full rounded-lg border-[#D0D5DD] border-[1px] bg-white flex justify-center cursor-pointer py-[10px] px-4"
        onClick={connectEOA}
      >
        {creating ? (
          <Spinner />
        ) : (
          <Image src="/wallet.svg" width="22" height="22" alt="" />
        )}
        <div className="ml-3 font-medium text-[#344054]">Connect EOA</div>
      </div>
      <div 
        className="button mt-3 w-full rounded-lg border-[#D0D5DD] border-[1px] bg-[rgb(64, 153, 255)] flex justify-center cursor-pointer py-[10px] px-4"
        onClick={walletConnect}
      >
        {wConnecting ? (
          <Spinner />
        ) : (
          <Image src="/walletconnect.svg" width="22" height="22" alt="" />
        )}
        <div className="ml-3 font-medium text-[#344054]">Wallet Connect</div>
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