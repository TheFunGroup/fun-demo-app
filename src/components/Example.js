import { useEffect, useState, useRef } from "react";
import Image from 'next/image';
import { networks,  connectToNetwork } from "../utils/networks";
import { tokens } from "../utils/tokens";
import { useOnClickOutside } from "../hooks/useOnClickOutside";
import TransferForm from "./TransferForm";
import SwapForm from "./SwapForm";
import PaymentMethod from "./PaymentMethod";

const examples = {
  "transfer": {
    title: "Transfer",
    description: "Specify the amount you are transferring and the address it is being sent to."
  },
  "swap": {
    title: "Uniswap",
    description: "Specify the amount and token you are exchanging, and the amount and token you will receive."
  }
}

export default function Example(props) {

  const example = examples[props.example];
  const setModal = props.setModal;
  const network = props.network;
  const [mustFund, setMustFund] = useState(false)

  const token = tokens[network][0];

  const [transfer, setTransfer] = useState([0.2, token.name]);
  const [receiverAddr, setReceiverAddr] = useState("");
  const [swapExchange, setSwapExchange] = useState([0.25, token.name]);
  const [swapReceive, setSwapReceive] = useState([200.25, "DAI"]);
  const [slippage, setSlippage] = useState(0.5);
  const [gas, setGas] = useState(.00056);

  const [paymentToken, setPaymentToken] = useState(token.name);

  function handleSubmit(){
    if(props.example == "transfer"){
      console.log("Transfer")
      setModal("deployed");
    } else if(props.example == "swap"){
      console.log("Swap");
      setMustFund(true);
    }
  }

  useEffect(() => {
    setMustFund(false)
  }, [paymentToken])

  return (
    <div className={`modal w-[690px] ${example == "transfer" ? "-mt-[128px]" : "-mt-[148px]"}`}>

      {mustFund && (
        <div className="alert w-full flex justify-between -mb-[72px] relative">
          <div className="flex items-center">
            <Image src="/alert.svg" width="24" height="24"/>
            <div className="text-[#101828] font-medium ml-3">{`Insufficient ${paymentToken} for transaction fees.`}</div>
          </div>
          <div className="button text-center px-[18px] py-[10px]" onClick={() => setModal("fund")}>Fund</div>
        </div>
      )}

      <div className="text-[#101828] font-semibold text-xl">{example.title}</div>
      <div className="text-[#667085] text-sm mt-1 mb-10 whitespace-nowrap">{example.description}</div>

      {props.example == "transfer" && (
        <TransferForm transfer={transfer} setTransfer={setTransfer} receiverAddr={receiverAddr} setReceiverAddr={setReceiverAddr} network={network}/>
      )}

      {props.example == "swap" && (
        <SwapForm 
          swapExchange={swapExchange} setSwapExchange={setSwapExchange} swapReceive={swapReceive} setSwapReceive={setSwapReceive}
          slippage={slippage} setSlippage={setSlippage} network={network}
        />
      )}

      <PaymentMethod token={paymentToken} setToken={setPaymentToken} network={network}/>

      <div className="text-[#101828] font-semibold mt-10">Transaction Fees</div>
      
      {props.example == "swap" && (
        <div className="flex justify-between w-full mt-3 text-sm">
          <div className="text-[#344054] font-medium">Slippage</div>
          <div className="text-[#667085]">{`${slippage}%`}</div>
        </div>
      )}

      <div className="flex justify-between w-full mt-3 text-sm">
        <div className="text-[#344054] font-medium">Gas</div>
        <div className="text-[#667085]">{`${gas} ${paymentToken || "ETH"}`}</div>
      </div>

      <div className="flex w-full items-center justify-between mt-10 text-center">

        <div className="w-[315px] button p-3 font-medium text-[#344054]" onClick={() => setModal("main")}>Cancel</div>
        <div 
          className="w-[315px] button-dark p-3 font-medium"
          onClick={handleSubmit}
        >
          {props.example == "transfer" ? "Transfer" : "Swap"}
        </div>

      </div>

    </div>
  )
}
