import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Layout from '../components/layout';
import ConnectWallet from "../components/modals/ConnectWallet";
import { useFun } from "../contexts/funContext";

export default function Connect() {
  const { wallet } = useFun();
  const router = useRouter();

  useEffect(() => {
    if(wallet){
      router.push("/")
    }
  }, [wallet])

  return (
    <div className="w-full flex flex-col items-center pt-[200px]">
      {!wallet && (
        <ConnectWallet />
      )}
    </div>
  )
}

Connect.getLayout = function getLayout(page) {
  return (
    <Layout>{page}</Layout>
  )
}
