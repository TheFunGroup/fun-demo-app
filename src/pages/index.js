import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Image from 'next/image';
import Layout from '../components/layout';
import { useFun } from "../contexts/funContext";
import ConnectWallet from "../components/modals/ConnectWallet";
import Main from "../components/modals/Main";
import { networks } from "../utils/networks";
import Example from "../components/modals/Example";
import FundWallet from "../components/modals/FundWallet";
import Deployed from "../components/modals/Deployed";
import Approve from "../components/modals/ApprovePM";

export default function Home() {

    const router = useRouter();
    const {eoa, setEOA, wallet, setWallet, network, setNetwork, deployedUrl, setDeployedUrl} = useFun();

    // useEffect(() => {
    //   if(!wallet){
    //     router.push("/connect")
    //   }
    // }, [wallet])

    return (
      <div className="w-full flex flex-col items-center pt-[200px]">
        
        {(wallet && network) && (
          <div className="w-full flex flex-col items-center">
            <Main wallet={wallet} setWallet={setWallet} eoa={eoa} setEOA={setEOA} network={network} setNetwork={setNetwork}/>
          </div>
          //   {modal == "transfer" && (
          //     <Example example="transfer" eoa={eoa} setModal={setModal} network={network} wallet={wallet} setDeployedUrl={setDeployedUrl}/>
          //   )}
          //   {modal == "swap" && (
          //     <Example example="swap" eoa={eoa} setModal={setModal} network={network} wallet={wallet} setDeployedUrl={setDeployedUrl}/>
          //   )}
          //   {modal == "fund" && (
          //     <FundWallet setModal={setModal} wallet={wallet}/>
          //   )}
          //   {modal == "approve" && (
          //     <Approve setModal={setModal} wallet={wallet}/>
          //   )}
          //   {modal == "deployed" && (
          //     <Deployed setModal={setModal} deployedUrl={deployedUrl}/>
          //   )}
          // </div>
        )}

      </div>
    )
}

Home.getLayout = function getLayout(page) {
  return (
    <Layout>{page}</Layout>
  )
}
