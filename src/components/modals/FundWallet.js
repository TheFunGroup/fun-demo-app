import { useEffect, useState, useRef } from "react";
import Image from 'next/image';
import { ethers } from "ethers";
import { FunWallet, FunWalletConfig } from "@fun-wallet/sdk";
import TokenSelect from "../forms/TokenSelect";

export default function FundWallet(props) {

  const [funding, setFunding] = useState(["0.5", "ETH"]);
  const [txAmount, setTxAmount] = useState(21)
  const setModal = props.setModal;

  function fundWallet(){
    console.log("Fund Wallet");
    setModal("main");
  }

  return (
    <div className="modal w-[512px]">
      <div className="text-[#101828] font-semibold text-xl">Fund your Fun Wallet</div>
      <div className="text-[#667085] text-sm mt-1 whitespace-nowrap">Add tokens to your wallet for transaction fees.</div>
      <div className="w-full mt-6 flex items-center justify-between">
        <div className="w-[198px]">
          <div className="text-[#344054] text-sm font-medium mb-[6px]">Amount</div>
          <div 
            className="w-full flex items-center justify-between border-[1px] border-[#D0D5DD] px-[14px] py-[10px] rounded-lg bg-white"
          >
            <input 
              className="border-0 outline-0 w-full text-[#667085]" placeholder="0.00" type="number" value={funding[0]}
              onChange={(e) => {setFunding([e.target.value, funding[1]])}}
            >
            </input>
            <div className="text-[#101828]">USDC</div>
            {/* <TokenSelect token={funding[1]} setToken={(value) => {setFunding([funding[0], value])}}/> */}
          </div>
        </div>
        
        <Image className="mt-7" src="/arrows.svg" width="20" height="20"/>

        <div className="w-[198px]">
          <div className="text-[#344054] text-sm font-medium mb-[6px]">Amount of Transactions</div>
          <div 
            className="w-full flex items-center justify-between border-[1px] border-[#D0D5DD] px-[14px] py-[10px] rounded-lg bg-white"
          >
            <div className="border-0 outline-0 w-full text-[#667085]">{txAmount}</div>
          </div>
        </div>
      </div>

      <div 
        className="button mt-8 w-full rounded-lg border-[#D0D5DD] border-[1px] bg-white flex justify-center cursor-pointer py-[10px] px-4"
        onClick={fundWallet}
      >
        <Image src="/wallet.svg" width="22" height="22"/>
        <div className="ml-3 font-medium text-[#344054]">Connect EOA</div>
      </div>

    </div>
  )
}
