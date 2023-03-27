import { useEffect, useState, useRef } from "react";
import Image from 'next/image';
import { ethers } from "ethers";
import { networks, connectToNetwork } from "../../utils/networks";
import { createFunWallet } from "../../scripts/wallet";
import Loader from "../misc/Loader";
import { Eoa } from "../../../../fun-wallet-sdk/auth/EoaAuth"

export default function ConnectWallet(props) {

  const setWallet = props.setWallet;
  const setNetwork = props.setNetwork;
  const setEOA = props.setEOA;

  const [creating, setCreating] = useState()
  
  async function connectEOA() {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    await provider.send('eth_requestAccounts', []); // <- this promps user to connect metamask
    const eoa = provider.getSigner();
    console.log(eoa)
    console.log(provider)
    // console.log(eoa)
    try {

      // console.log(eoa)
      // const auth = new Eoa({ signer: eoa })
      // console.log(auth)
      const auth = new Eoa({privateKey: "0x6270ba97d41630c84de28dd8707b0d1c3a9cd465f7a2dba7d21b69e7a1981064"})
      console.log(auth)
      const network = 5
      setCreating(true)
      connectToNetwork(network).then(async () => {
        const FunWallet = await createFunWallet(auth, network)

        setEOA(auth);
        setNetwork(network)
        setWallet(FunWallet);
        setCreating(false)
      })
    } catch (e) {

    }
  }

  return (
    <div className={`w-[360px] modal flex flex-col items-center text-center`} >
      <Image src="/fun.svg" width="52" height="42" />
      <div className="font-semibold text-2xl mt-6 text-[#101828]">Let the Fun begin</div>
      <div className="text-sm text-[#667085] mt-1">Unlock the power of Fun Wallets.</div>
      <div
        className="button mt-8 w-full rounded-lg border-[#D0D5DD] border-[1px] bg-white flex justify-center cursor-pointer py-[10px] px-4"
        onClick={connectEOA}
      >
        {creating ? (
          <Loader />
        ) : (
          <Image src="/wallet.svg" width="22" height="22" />
        )}
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