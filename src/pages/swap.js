import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Image from 'next/image';
import Layout from '../components/layout';
import Example from "../components/modals/Example";
import { useFun } from "../contexts/funContext";

export default function Swap() {

    const {eoa, setEOA, wallet, setWallet, network, setNetwork, deployedUrl, setDeployedUrl} = useFun();
    const router = useRouter();

    return (
      <div className="w-full flex flex-col items-center">
        <Example example="swap" eoa={eoa} network={network} wallet={wallet} setDeployedUrl={setDeployedUrl}/>
      </div>
    )
}

Swap.getLayout = function getLayout(page) {
  return (
    <Layout>{page}</Layout>
  )
}
