import { useEffect, useState, useRef } from "react";
import Image from 'next/image';
import { ethers } from "ethers";
import TokenSelect from "../forms/TokenSelect";
import { handleApprove } from "../../scripts/approve";
export default function Approve(props) {

  const [amount, setAmount] = useState(["20"]);
  const setModal = props.setModal;
  const wallet = props.wallet;

  function approve(){
    handleApprove(wallet, amount).then((data) => {
      setModal("main");
    })
  }

  return (
    <div className="modal w-[512px]">
      <div className="text-[#101828] font-semibold text-xl">Give permission to pay for gas</div>
      <div className="text-[#667085] text-sm mt-1 whitespace-nowrap">Give Fun access to tokens to pay gas fees.</div>
      <div className="w-full mt-6 flex items-center justify-between">
        <div className="w-full">
          <div className="text-[#344054] text-sm font-medium mb-[6px]">Amount</div>
          <div 
            className="w-full flex items-center justify-between border-[1px] border-[#D0D5DD] px-[14px] py-[10px] rounded-lg bg-white"
          >
            <input 
              className="border-0 outline-0 w-full text-[#667085]" placeholder="0.00" type="number" value={amount}
              onChange={(e) => {setAmount(e.target.value)}}
            >
            </input>
            <div className="text-[#101828]">USDC</div>
            {/* <TokenSelect token={funding[1]} setToken={(value) => {setFunding([funding[0], value])}}/> */}
          </div>
        </div>
        
        {/* <Image className="mt-7" src="/arrows.svg" width="20" height="20"/>

        <div className="w-[198px]">
          <div className="text-[#344054] text-sm font-medium mb-[6px]">Amount of Transactions</div>
          <div 
            className="w-full flex items-center justify-between border-[1px] border-[#D0D5DD] px-[14px] py-[10px] rounded-lg bg-white"
          >
            <div className="border-0 outline-0 w-full text-[#667085]">{txAmount}</div>
          </div>
        </div> */}
      </div>

      <div className="flex w-full items-center justify-between mt-10 text-center">

        <div className="w-[224px] button p-3 font-medium text-[#344054]" onClick={() => setModal("main")}>Cancel</div>
        <div 
          className="w-[224px] button-dark p-3 font-medium"
          onClick={approve}
        >
          Give Access
        </div>

      </div>

    </div>
  )
}
