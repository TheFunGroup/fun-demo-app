import { useEffect, useState, useRef } from "react";
import Image from 'next/image';
import Layout from '../components/layout';
import ConnectWallet from "../components/modals/ConnectWallet";
import Main from "../components/modals/Main";
import { networks } from "../utils/networks";
import Example from "../components/modals/Example";
import FundWallet from "../components/modals/FundWallet";
import Deployed from "../components/modals/Deployed";

export default function Home() {

    const [eoa, setEOA] = useState();
    const [wallet, setWallet] = useState()
    const [network, setNetwork] = useState();
    const [modal, setModal] = useState("main")

    return (
      <div className="w-full h-full flex flex-col items-center pt-[200px]">
        {!wallet && (
          <ConnectWallet setWallet={setWallet} setNetwork={setNetwork} setEOA={setEOA}/>
        )}
        
        {(wallet && network) && (
          <div className="w-full h-full flex flex-col items-center">
            {modal == "main" && (
              <Main setModal={setModal} wallet={wallet} setWallet={setWallet} eoa={eoa} setEOA={setEOA} network={network} setNetwork={setNetwork}/>
            )}
            {modal == "transfer" && (
              <Example example="transfer" setModal={setModal} network={network} wallet={wallet}/>
            )}
            {modal == "swap" && (
              <Example example="swap" setModal={setModal} network={network} wallet={wallet}/>
            )}
            {modal == "fund" && (
              <FundWallet setModal={setModal} wallet={wallet}/>
            )}
            {modal == "deployed" && (
              <Deployed setModal={setModal}/>
            )}
          </div>
        )}

      </div>
    )
}

Home.getLayout = function getLayout(page) {
  return (
    <Layout>{page}</Layout>
  )
}
