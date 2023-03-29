import { useEffect, useState, useRef } from "react";
import Image from 'next/image';
import { useRouter } from "next/router";
import { useFun } from "../../contexts/funContext";
import { networks,  connectToNetwork } from "../../utils/networks";
import { tokens } from "../../utils/tokens";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";
import TransferForm from "../forms/TransferForm";
import SwapForm from "../forms/SwapForm";
import PaymentMethod from "../forms/PaymentMethod";
import { calculateGas } from "../../scripts/calculateGas";
import { handleSwap } from "../../scripts/swap";
import { handleTransfer } from "../../scripts/transfer";
import Spinner from "../misc/Spinner";

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

  const router = useRouter();
  const example = examples[props.example];
  const network = 5;

  const {wallet, setDeployedUrl, setLoading} = useFun();

  const [mustFund, setMustFund] = useState(false);
  const [mustApprove, setMustApprove] = useState(false);
  const [transfer, setTransfer] = useState([0.1, tokens[network][0]]);
  const [receiverAddr, setReceiverAddr] = useState("");
  const [swapExchange, setSwapExchange] = useState([0.10, tokens[network][0]]);
  const [swapReceive, setSwapReceive] = useState([180.60, tokens[network][1]]);
  const [slippage, setSlippage] = useState(0.5);
  const [gas, setGas] = useState("Calculating...");
  const [paymentToken, setPaymentToken] = useState("ETH");
  const [submitReady, setSubmitReady] = useState(false);
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState();

  function handleSubmit(){
    if(submitting) return;
    setSubmitting(true)
    setLoading(true)
    if(props.example == "transfer"){
      handleTransfer(wallet, paymentToken, {
        token: transfer[1],
        amount: transfer[0],
        to: receiverAddr
      }, props.eoa).then((data) => {
        if(data.success){
          setDeployedUrl(data.explorerUrl)
          router.push("/success");
        } else if(data.mustFund){
          setMustFund(true);
        } else if(data.mustApprove){
          setMustApprove(true);
        } else if(data.error){
          setError(data.error)
        }
        setSubmitting(false)
        setLoading(false)
      })
    } else if(props.example == "swap"){
      handleSwap(wallet, paymentToken, {
        token1: swapExchange[1],
        amount: swapExchange[0],
        token2: swapReceive[1]
      }, props.eoa).then((data) => {
        if(data.success){
          setDeployedUrl(data.explorerUrl)
          router.push('/success');
        } else if(data.mustFund){
          setMustFund(true);
        } else if(data.mustApprove){
          setMustApprove(true);
        } else if(data.error){
          setError(data.error)
        }
        setSubmitting(false)
        setLoading(false)
      })
    }
  }

  useEffect(() => {
    setMustFund(false)
    setMustApprove(false)
  }, [paymentToken])

  useEffect(() => {
    if(props.example == "transfer"){
      calculateGas(paymentToken, wallet, null, {
        token: transfer[1],
        amount: transfer[0],
        to: receiverAddr
      }).then((gas) => {
        setGas(`${gas.token} ${paymentToken} · $${gas.usd}`)
      })
      if(transfer[0] > 0 && receiverAddr){
        setSubmitReady(true)
      } else {
        setSubmitReady(false)
      }
    } else if(props.example == "swap"){
      calculateGas(paymentToken, wallet, {
        token1: swapExchange[1],
        amount: swapExchange[0],
        token2: swapReceive[1]
      }, null).then((gas) => {
        setGas(`${gas.token} ${paymentToken} · $${gas.usd}`)
      })
      if(swapExchange[0] > 0){
        setSubmitReady(true)
      } else {
        setSubmitReady(false)
      }
    }
  }, [paymentToken, swapExchange, swapReceive, transfer, receiverAddr])

  useEffect(() => {
    setLoading(false)
  }, [])

  useEffect(() => {
    if(error){
      setTimeout(() => {
        setError(null)
      }, 2000)
    }
  }, [error])

  return (
    <div className={`modal w-[690px] my-12`}>

      {mustFund && (
        <div className="alert w-full flex justify-between -mb-[80px] relative">
          <div className="flex items-center">
            <Image src="/alert.svg" width="24" height="24" alt=""/>
            <div className="text-[#101828] font-medium ml-3">{`Insufficient ${paymentToken} for transaction fees.`}</div>
          </div>
          <div className="button text-center px-[18px] py-[10px]" onClick={() => router.push("/fund")}>Fund</div>
        </div>
      )}

      {mustApprove && (
        <div className="alert w-full flex justify-between -mb-[80px] relative">
          <div className="flex items-center">
            <Image src="/alert.svg" width="24" height="24" alt=""/>
            <div className="text-[#101828] font-medium ml-3">{`Token Sponsor doesn’t have the required authorization amount.`}</div>
          </div>
          <div className="button text-center px-[18px] py-[10px]" onClick={() => router.push("/approve")}>Give</div>
        </div>
      )}

      {error && (
        <div className="alert w-full flex justify-between -mb-[58px] relative">
         <div className="flex items-center">
           <Image src="/alert.svg" width="24" height="24" alt=""/>
           <div className="text-[#101828] font-medium ml-3">{`There was an error performing the transaction.`}</div>
         </div>
       </div>
      )}

      <div className="text-[#101828] font-semibold text-xl">{example.title}</div>
      <div className="text-[#667085] text-sm mt-1 mb-10 whitespace-nowrap">{example.description}</div>

      {props.example == "transfer" && (
        <TransferForm transfer={transfer} setTransfer={setTransfer} receiverAddr={receiverAddr} setReceiverAddr={setReceiverAddr}/>
      )}

      {props.example == "swap" && (
        <SwapForm 
          swapExchange={swapExchange} setSwapExchange={setSwapExchange} swapReceive={swapReceive} setSwapReceive={setSwapReceive}
          slippage={slippage} setSlippage={setSlippage}
        />
      )}

      <PaymentMethod token={paymentToken} setToken={setPaymentToken}/>

      <div className="text-[#101828] font-semibold mt-10">Transaction Fees</div>
      
      {props.example == "swap" && (
        <div className="flex justify-between w-full mt-3 text-sm">
          <div className="text-[#344054] font-medium">Slippage</div>
          <div className="text-[#667085]">{`${slippage}%`}</div>
        </div>
      )}

      <div className="flex justify-between w-full mt-3 text-sm">
        <div className="text-[#344054] font-medium">Gas</div>
        <div className="text-[#667085]">{`${gas}`}</div>
      </div>

      <div className="flex w-full items-center justify-between mt-10 text-center">

        <div className="w-[315px] button p-3 font-medium text-[#344054]" onClick={() => router.push("/")}>Cancel</div>
        <div 
          className="w-[315px] button-dark p-3 font-medium flex items-center justify-center"
          onClick={handleSubmit}
          style={ (!submitReady || submitting) ? { opacity: 0.8, pointerEvents: "none" } : {}}
        >
          <div>{props.example == "transfer" ? "Transfer" : "Swap"}</div>
          {submitting && (
            <Spinner marginLeft="8px"/>
          )}
        </div>

      </div>

    </div>
  )
}
