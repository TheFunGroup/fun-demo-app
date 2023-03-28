import { useEffect, useState, useRef } from "react";
import TokenSelect from "./TokenSelect";
import Input from "./Input";

export default function TransferForm(props) {

  const {
    transfer, setTransfer,
    receiverAddr, setReceiverAddr
  } = props;

  const transferRef = useRef();
  const receiverRef = useRef();

  return (
    <div className="w-full flex items-center justify-between">

      <Input 
        className="w-[309px]" 
        label="Transfer Quantity & Token"
        placeholder="0.00"
        type="number"
        value={transfer[0]}
        onChange={(e) => {setTransfer([e.target.value, transfer[1]])}}
        ref={transferRef}
        tokenSelect
        token={transfer[1]}
        setToken={(value) => {setTransfer([transfer[0], value])}}
      />

      <Input 
        className="w-[309px]" 
        label="Receiver Address"
        placeholder="0x..."
        value={receiverAddr}
        onChange={(e) => {setReceiverAddr(e.target.value)}}
        ref={receiverRef}
      />

    </div>
  )
}
