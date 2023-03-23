import { useEffect, useState, useRef } from "react";
import Image from 'next/image';
import { ethers } from "ethers";
import { FunWallet, FunWalletConfig } from "@fun-wallet/sdk"
import NetworkSelect from "./NetworkSelect";
import WalletView from "./WalletView";

export default function Main(props) {

  const wallet = props.wallet;
  const setWallet = props.setWallet;
  const eoa = props.eoa;
  const setEOA = props.eoa;
  const network = props.network;
  const setNetwork = props.setNetwork;
  const setModal = props.setModal;

  return (
    <div className="modal w-[690px]">
      <div className="w-full flex p-2 justify-between">
        <div className="">
          <div className="text-[#101828] font-semibold text-xl">Welcome!</div>
          <div className="text-[#667085] text-sm mt-1 whitespace-nowrap">Explore the possibilities of a Fun Wallet!</div>
        </div>
        <div className="flex">
          <NetworkSelect network={network} setNetwork={setNetwork} setWallet={setWallet} eoa={props.eoa}/>
          <WalletView wallet={wallet} setWallet={setWallet} network={network} setEOA={setEOA} eoa={props.eoa}/>
        </div>
      </div>
      <div className="w-full mt-6">
        <div className="button flex items-center text-sm p-4" onClick={() => setModal("swap")}>
          <Image src="/swap.svg" width="40" height="40"/>
          <div className="ml-3">
            <div className="font-medium text-[#344054]">Uniswap</div>
            <div className="text-[#667085]">A decentralized exchange protocol that enables automated liquidity provision and trading on Ethereum.</div>
          </div>
        </div>
        <div className="button flex items-center text-sm mt-4 p-4" onClick={() => setModal("transfer")}>
          <Image src="/transfer.svg" width="40" height="40"/>
          <div className="ml-3">
            <div className="font-medium text-[#344054]">Token Transfer</div>
            <div className="text-[#667085]">A smart wallet is the secure movement of digital assets from one wallet to another.</div>
          </div>
        </div>
      </div>
    </div>
  )
}
