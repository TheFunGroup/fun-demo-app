import { useEffect, useState, useRef } from "react";
import Image from 'next/image';
import { ethers } from "ethers";
import { FunWallet, FunWalletConfig } from "@fun-wallet/sdk"
import { networks, connectToNetwork } from "../utils/networks";
import { createFunWallet } from "../scripts/wallet";

export default function ConnectWallet(props) {

  const setWallet = props.setWallet;
  const setNetwork = props.setNetwork;
  const setEOA = props.setEOA;

  async function connectEOA(){
    const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
    await provider.send('eth_requestAccounts', []) // <- this promps user to connect external wallet
    const eoa = provider.getSigner()
    const network = networks[ethereum.networkVersion] ? ethereum.networkVersion : 1;
    const FunWallet = await createFunWallet(eoa, network)
    setEOA(eoa);
    setNetwork(network)
    setWallet(FunWallet);
  }

  return (
    <div className={`w-[360px] modal flex flex-col items-center text-center`} >
      <Image src="/fun.svg" width="52" height="42"/>
      <div className="font-semibold text-2xl mt-6 text-[#101828]">Let the Fun begin</div>
      <div className="text-sm text-[#667085] mt-1">Unlock the power of Fun Wallets.</div>
      <div 
        className="button mt-8 w-full rounded-lg border-[#D0D5DD] border-[1px] bg-white flex justify-center cursor-pointer py-[10px] px-4"
        onClick={connectEOA}
      >
        <Image src="/wallet.svg" width="22" height="22"/>
        <div className="ml-3 font-medium text-[#344054]">Connect EOA</div>
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