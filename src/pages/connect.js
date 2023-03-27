import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Image from 'next/image';
import Layout from '../components/layout';
import ConnectWallet from "../components/modals/ConnectWallet";
import { useFun } from "../contexts/funContext";

export default function Connect() {

    const {eoa, setEOA, wallet, setWallet, network, setNetwork, deployedUrl, setDeployedUrl} = useFun();
    const router = useRouter();

    useEffect(() => {
      if(wallet){
        router.push("/")
      }
    }, [wallet])

    return (
      <div className="w-full flex flex-col items-center pt-[200px]">
        {!wallet && (
          <ConnectWallet setWallet={setWallet} setNetwork={setNetwork} setEOA={setEOA} />
        )}
      </div>
    )
}

Connect.getLayout = function getLayout(page) {
  return (
    <Layout>{page}</Layout>
  )
}
