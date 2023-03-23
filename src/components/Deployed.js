import { useEffect, useState, useRef } from "react";
import Image from 'next/image';
import { ethers } from "ethers";
import { FunWallet, FunWalletConfig } from "@fun-wallet/sdk";
import TokenSelect from "./TokenSelect";

export default function Deployed(props) {

  const setModal = props.setModal;

  return (
    <div className="modal w-[690px]">
      <Image src="/success.svg" width="48" height="48"/>
      <div className="text-[#101828] font-semibold text-xl mt-6">Action Deployed</div>
      <div className="text-[#667085] text-sm mt-1 whitespace-nowrap">Your transaction has been deployed to the chain! Please find on the block explorer.</div>
      <div className="flex w-full items-center justify-between mt-6 text-center">
        <div className="w-[315px] button p-3 font-medium text-[#344054]" onClick={() => setModal("main")}>Back</div>
        <div className="w-[315px] button-dark p-3 font-medium" onClick={() => setModal("main")}>Block Explorer</div>
      </div>
    </div>
  )
}
