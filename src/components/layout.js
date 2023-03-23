

import { useEffect, useState, useRef } from "react";
import Head from 'next/head'
import { useRouter } from 'next/router';

export default function Layout(props) {

  const router = useRouter();

  return (
    <div className="w-full h-full">
      <Head>
        <title>fun.xyz demo</title>
        <meta name="description" content="The Wallet Development Platform"/>
        <link rel="icon" href="/fun.svg?" />
      </Head>

      <main className="w-full h-full flex flex-col overflow-y-scroll">
        <div className={`w-full h-full`}>
          {props.children}
        </div>
      </main>

    </div>
  )
}
