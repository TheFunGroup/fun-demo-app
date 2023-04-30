

import { useEffect, useState, useRef } from "react";
import Head from 'next/head'
import { useRouter } from 'next/router';
import Loader from "./misc/Loader";
import { useFun } from "../contexts/funContext";

export default function Layout(props) {

  const router = useRouter();
  const { loading, setLoading } = useFun()

  return (
    <div className="w-full h-full">
      <Head>
        <title>fun.xyz demo</title>
        <meta name="description" content="The Wallet Development Platform"/>
        <link rel="icon" href="/fun.svg?" />
      </Head>

      <main className="w-full h-full flex flex-col">
        {loading && (
          <Loader />
        )}
        <div className={`w-full h-full overflow-y-scroll`}>
          {props.children}
        </div>
      </main>

    </div>
  )
}
