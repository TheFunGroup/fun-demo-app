import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Image from 'next/image';
import Layout from '../components/layout';
import FundWallet from "../components/modals/FundWallet";
import { useFun } from "../contexts/funContext";

export default function Fund() {

    const {eoa, setEOA, wallet, setWallet, network, setNetwork, deployedUrl, setDeployedUrl} = useFun();
    const router = useRouter();

    return (
      <div className="w-full flex flex-col items-center">
        <FundWallet wallet={wallet}/>
      </div>
    )
}

Fund.getLayout = function getLayout(page) {
  return (
    <Layout>{page}</Layout>
  )
}
