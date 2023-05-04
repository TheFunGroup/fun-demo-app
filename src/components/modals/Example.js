import { useEffect, useState, useRef } from "react";
import Image from 'next/image';
import { useRouter } from "next/router";
import { useFun } from "../../contexts/funContext";
import { tokens } from "../../utils/tokens";
import TransferForm from "../forms/TransferForm";
import SwapForm from "../forms/SwapForm";
import NFTForm from "../forms/NFTForm";
import PaymentMethod from "../forms/PaymentMethod";
import { calculateGas } from "../../scripts/calculateGas";
import { handleSwap } from "../../scripts/swap";
import { handleTransfer } from "../../scripts/transfer";
import { handleMintNFT } from "../../scripts/mintNFT";
import Spinner from "../misc/Spinner";
import { getAddress } from "../../scripts/wallet";

const examples = {
  "nft": {
    title: "Mint NFT",
    description: "Use your FunWallet to mint the selected NFT",
    submit: "Mint"
  },
  "transfer": {
    title: "Transfer",
    description: "Specify the amount you are transferring and the address it is being sent to.",
    submit: "Transfer"
  },
  "swap": {
    title: "Uniswap",
    description: "Specify the amount and token you are exchanging, and the amount and token you will receive.",
    submit: "Swap"
  }
}

export default function Example(props) {

  const router = useRouter();
  const example = examples[props.example];

  const {wallet, eoa, network, setDeployedUrl, setMinted, setLoading, paymentToken, setPaymentToken, setPaymentAddr, setPaymasterAddress} = useFun();

  const [mustFund, setMustFund] = useState(false);
  const [mustApprove, setMustApprove] = useState(false);
  const [transfer, setTransfer] = useState([0.01, tokens[network][0]]);
  const [receiverAddr, setReceiverAddr] = useState("");
  const [receiverTwitter, setReceiverTwitter] = useState("");
  const [swapExchange, setSwapExchange] = useState([0.01, tokens[network][0]]);
  const [swapReceive, setSwapReceive] = useState([18.06, tokens[network][1]]);
  const [slippage, setSlippage] = useState(0.5);
  const [gas, setGas] = useState("Calculating...");
  const [submitReady, setSubmitReady] = useState(false);
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState();

  async function handleSubmit(){
    if(submitting) return;
    setSubmitting(true)
    setLoading(true)
    if(props.example == "transfer"){
      let addr = receiverAddr;
      if (!addr && receiverTwitter) {
        if (receiverTwitter[0] != "@") {
          setError("Twitter handle must start with @")
          setSubmitting(false)
          setLoading(false)
          return;
        }
        addr = await getAddress(`twitter###${receiverTwitter.substring(1)}`, network || 5);
      }
      if(!addr) {
        setError("No wallet address found from twitter handle")
        setSubmitting(false)
        setLoading(false)
        return;
      } else {
        handleTransfer(wallet, paymentToken, {
          token: transfer[1],
          amount: transfer[0],
          to: addr
        }, eoa).then((data) => {
          if(data.success){
            setDeployedUrl(data.explorerUrl)
            router.push("/success");
          } else if(data.mustFund){
            setMustFund(true);
          } else if(data.mustApprove){
            setPaymentAddr(data.tokenAddr);
            setPaymasterAddress(data.paymasterAddress)
            setMustApprove(true);
          } else if(data.error){
            setError(data.error)
          }
          setSubmitting(false)
          setLoading(false)
        })
      }
    } else if(props.example == "swap"){
      handleSwap(wallet, paymentToken, {
        token1: swapExchange[1],
        amount: swapExchange[0],
        token2: swapReceive[1]
      }, eoa).then((data) => {
        if(data.success){
          setDeployedUrl(data.explorerUrl)
          router.push('/success');
        } else if(data.mustFund){
          setMustFund(true);
        } else if(data.mustApprove){
          setPaymentAddr(data.tokenAddr);
          setPaymasterAddress(data.paymasterAddress)
          setMustApprove(true);
        } else if(data.error){
          setError(data.error)
        }
        setSubmitting(false)
        setLoading(false)
      })
    } else if(props.example == "nft"){
      handleMintNFT(wallet, paymentToken, {
        nft: props.nft, //add extra nft data here
      }, eoa).then((data) => {
        if(data.success){
          setMinted(data.nft?.nft)
          setDeployedUrl(data.explorerUrl)
          router.push('/success');
        } else if(data.mustFund){
          setMustFund(true);
        } else if(data.mustApprove){
          setPaymentAddr(data.tokenAddr);
          setPaymasterAddress(data.paymasterAddress)
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
      if(paymentToken !== "gasless"){
        calculateGas(paymentToken, wallet, null, {
          token: transfer[1],
          amount: transfer[0],
          to: receiverAddr
        }).then((gas) => {
          setGas(`${gas.token} ${paymentToken} · $${gas.usd}`)
        })
      } else {
        setGas(`$0.00`)
      }
      if(transfer[0] > 0 && (receiverAddr || receiverTwitter)){
        setSubmitReady(true)
      } else {
        setSubmitReady(false)
      }
    } else if(props.example == "swap"){
      if(paymentToken !== "gasless"){
        calculateGas(paymentToken, wallet, {
          token1: swapExchange[1],
          amount: swapExchange[0],
          token2: swapReceive[1]
        }, null).then((gas) => {
          setGas(`${gas.token} ${paymentToken} · $${gas.usd}`)
        })
      } else {
        setGas(`$0.00`)
      }
      if(swapExchange[0] > 0){
        setSubmitReady(true)
      } else {
        setSubmitReady(false)
      }
    } else if(props.example == "nft"){
      if(props.nft) setSubmitReady(true);
    }
  }, [paymentToken, swapExchange, swapReceive, transfer, receiverAddr, receiverTwitter])

  useEffect(() => {
    setLoading(false)
  }, [])

  return (
    <div className={`modal w-[690px] ${props.example == "swap" ? "my-8" : "my-12"}`}>

      {mustFund && (
        <div className="alert w-full flex justify-between -mb-[80px] relative">
          <div className="flex items-center">
            <Image src="/alert.svg" width="24" height="24" alt=""/>
            <div className="text-[#101828] font-medium ml-3">{`Insufficient ${paymentToken} for transaction fees.`}</div>
          </div>
          <div className="button text-center px-[18px] py-[10px]" onClick={() => router.push(`/fund?example=${props.example}`)}>Fund</div>
        </div>
      )}

      {mustApprove && (
        <div className="alert w-full flex justify-between -mb-[80px] relative">
          <div className="flex items-center">
            <Image src="/alert.svg" width="24" height="24" alt=""/>
            <div className="text-[#101828] font-medium ml-3">{`Token Sponsor doesn’t have the required authorization amount.`}</div>
          </div>
          <div className="button text-center px-[18px] py-[10px]" onClick={() => router.push(`/approve?example=${props.example}`)}>Give</div>
        </div>
      )}

      {error && (
        <div className="alert w-full flex justify-between -mb-[80px] relative">
         <div className="flex">
           <Image src="/alert.svg" width="24" height="24" alt="" className="max-h-[24px]"/>
           <div className="text-[#101828] font-medium ml-3">{error}</div>
         </div>
         <Image src="/close.svg" width="24" height="24" alt="" className="max-h-[24px] cursor-pointer hover:opacity-75" onClick={() => setError(null)}/>
       </div>
      )}

      <div className="text-[#101828] font-semibold text-xl">{example.title}</div>
      <div className="text-[#667085] text-sm mt-1 mb-10 whitespace-nowrap">{example.description}</div>

      {props.example == "nft" && (
        <NFTForm nft={props.nft}/>
      )}

      {props.example == "transfer" && (
        <TransferForm 
          transfer={transfer} setTransfer={setTransfer}
          receiverAddr={receiverAddr} setReceiverAddr={setReceiverAddr}
          receiverTwitter={receiverTwitter} setReceiverTwitter={setReceiverTwitter}
        />
      )}

      {props.example == "swap" && (
        <SwapForm 
          swapExchange={swapExchange} setSwapExchange={setSwapExchange} swapReceive={swapReceive} setSwapReceive={setSwapReceive}
          slippage={slippage} setSlippage={setSlippage}
        />
      )}

      <PaymentMethod token={paymentToken} setToken={setPaymentToken}/>

      {/* <div className="text-[#101828] font-semibold mt-10">Transaction Fees</div> */}
      
      {props.example == "swap" && (
        <div className="flex justify-between w-full mt-3 text-sm">
          <div className="text-[#344054] font-medium">Slippage</div>
          <div className="text-[#667085]">{`${slippage}%`}</div>
        </div>
      )}

      {/* <div className="flex justify-between w-full mt-3 text-sm">
        <div className="text-[#344054] font-medium">Gas</div>
        <div className="text-[#667085]">{`${gas}`}</div>
      </div> */}

      <div className="flex w-full items-center justify-between mt-10 text-center">

        <div className="w-[315px] button p-3 font-medium text-[#344054]" onClick={() => router.push("/")}>Cancel</div>
        <div 
          className="w-[315px] button-dark p-3 font-medium flex items-center justify-center"
          onClick={handleSubmit}
          style={ (!submitReady || submitting) ? { opacity: 0.8, pointerEvents: "none" } : {}}
        >
          <div className={submitting ? "mr-2" : ""}>{examples[props.example].submit}</div>
          {submitting && (
            <Spinner/>
          )}
        </div>

      </div>

    </div>
  )
}
