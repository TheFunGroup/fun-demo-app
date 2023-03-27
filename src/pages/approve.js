import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Image from 'next/image';
import Layout from '../components/layout';
import ApprovePM from "../components/modals/ApprovePM";
import { useFun } from "../contexts/funContext";

export default function Approve() {

    const {eoa, setEOA, wallet, setWallet, network, setNetwork, deployedUrl, setDeployedUrl} = useFun();
    const router = useRouter();

    return (
      <div className="w-full flex flex-col items-center">
        <ApprovePM setModal={setModal} wallet={wallet}/>
      </div>
    )
}

Approve.getLayout = function getLayout(page) {
  return (
    <Layout>{page}</Layout>
  )
}
