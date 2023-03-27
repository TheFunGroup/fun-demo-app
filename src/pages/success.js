import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Image from 'next/image';
import Layout from '../components/layout';
import Deployed from "../components/modals/Deployed";
import { useFun } from "../contexts/funContext";

export default function Success() {

    const {eoa, setEOA, wallet, setWallet, network, setNetwork, deployedUrl, setDeployedUrl} = useFun();
    const router = useRouter();
    
    return (
      <div className="w-full flex flex-col items-center">
          <Deployed deployedUrl={deployedUrl}/>
      </div>
    )
}

Success.getLayout = function getLayout(page) {
  return (
    <Layout>{page}</Layout>
  )
}
