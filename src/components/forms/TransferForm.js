import { useEffect, useState, useRef } from "react";
import Image from 'next/image';
import { networks,  connectToNetwork } from "../../utils/networks";
import { tokens } from "../../utils/tokens";

import { useOnClickOutside } from "../../hooks/useOnClickOutside";
import TokenSelect from "./TokenSelect";

export default function TransferForm(props) {

  const {
    transfer, setTransfer,
    receiverAddr, setReceiverAddr,
    network
  } = props;

  const transferRef = useRef();
  const receiverRef = useRef();

  return (
    <div className="w-full flex items-center justify-between">

      <div className="w-[309px]">
        <div className="text-[#344054] text-sm font-medium mb-[6px]">Transfer Quantity & Token</div>
        <div 
          className="w-full flex items-center justify-between border-[1px] border-[#D0D5DD] px-[14px] py-[10px] rounded-lg bg-white"
          // onClick={() => {transferRef?.current.focus()}}
        >
          <input 
            className="border-0 outline-0 w-full text-[#667085]" placeholder="0.00" type="number" value={transfer[0]}
            onChange={(e) => {setTransfer([e.target.value, transfer[1]])}}
            ref={transferRef}
          ></input>
          <TokenSelect token={transfer[1]} setToken={(value) => {setTransfer([transfer[0], value])}} network={network}/>
        </div>
      </div>

      <div className="w-[309px]">
        <div className="text-[#344054] text-sm font-medium mb-[6px]">Receiver Address</div>
        <div 
          className="w-full flex items-center justify-between border-[1px] border-[#D0D5DD] px-[14px] py-[10px] rounded-lg bg-white font-mono"
          onClick={() => {receiverRef?.current.focus()}}
        >
          <input 
            className="border-0 outline-0 w-full text-[#667085] font-mono" placeholder="0x..." value={receiverAddr}
            onChange={(e) => {setReceiverAddr(e.target.value)}}
            ref={receiverRef}
          ></input>
        </div>
      </div>

    </div>
  )
}
