import { useEffect, useState, useRef } from "react";
import Image from 'next/image';
import { ethers } from "ethers";
import { networks, connectToNetwork } from "../../utils/networks";
import { createFunWallet } from "../../scripts/wallet";
import Spinner from "../misc/Spinner";
import { Eoa } from "@fun-wallet/sdk/auth"
import { useFun } from "../../contexts/funContext";

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
      await (new ethers.providers.Web3Provider(window.ethereum, "any")).send('eth_requestAccounts', []); // <- this promps user to connect metamask
      await connectToNetwork(5);
      const walletConnectProvider = new WalletConnectProvider({
        rpc: {
          5: "https://goerli.blockpi.network/v1/rpc/public"
        },
        qrcode: true,
      });
      //  Enable session (triggers QR Code modal)
      await walletConnectProvider.enable();
      const provider = new ethers.providers.Web3Provider(walletConnectProvider);
      const eoa = provider.getSigner()
      // console.log(eoa)
      // console.log(provider)
      const auth = new Eoa({ signer: eoa })
      // const auth = new Eoa({privateKey: "0x6270ba97d41630c84de28dd8707b0d1c3a9cd465f7a2dba7d21b69e7a1981064"})
      // console.log(auth)
      const network = 5
      setCreating(true)
      setLoading(true)
      // connectToNetwork(network).then(async () => {
      const FunWallet = await createFunWallet(auth, network)
      setEOA(auth);
      setNetwork(network)
      setWallet(FunWallet);
      setCreating(false)
      setLoading(false)
      // })
    } catch (e) {
      console.log(e)
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
        className="walletConnectBtn mt-3 w-full rounded-lg border-[#D0D5DD] border-[1px] bg-[rgb(64, 153, 255)] flex justify-center cursor-pointer py-[10px] px-4"
        onClick={walletConnect}
      >
        <div className="font-medium text-white">Wallet Connect</div>
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