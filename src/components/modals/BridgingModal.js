import { useEffect, useState } from "react";
import Image from 'next/image';
import { useRouter } from "next/router";
import { useFun } from "../../contexts/funContext";
import BridgeForm from "../forms/BridgeForm";
import PaymentMethod from "../forms/PaymentMethod";
import { calculateGas } from "../../scripts/calculateGas";

import Spinner from "../misc/Spinner";

const BridgeModalConfig = {
    title: "Bridge",
    description: "Bridge your tokens from one blockchain to another. Bridging can take some time to complete, so please be patient.",
    submit: "Bridge"
    
  };

export default function Bridge(props) {

  const router = useRouter();

  const {wallet, eoa, network, setDeployedUrl, setMinted, setLoading, paymentToken, setPaymentToken, setPaymentAddr, setPaymasterAddress} = useFun();

  const [mustFund, setMustFund] = useState(false);
  const [mustApprove, setMustApprove] = useState(false);
  const [fromNetwork, setFromNetwork] = useState("ARB");
  const [toNetwork, setToNetwork] = useState("MATIC");
  const [bridgeAsset, setBridgeAsset] = useState({name: "ETH", amount: 0});
  const [gas, setGas] = useState("Calculating...");
  const [submitReady, setSubmitReady] = useState(false);
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState();

  async function handleSubmit(){
    if(submitting) return;
    setSubmitting(true);
    setLoading(true);
    setTimeout(() => {setSubmitting(false);
        setLoading(false);
    }, 2000)
  }

  useEffect(() => {
    setMustFund(false)
    setMustApprove(false)
  }, [paymentToken])


  useEffect(() => {
    setLoading(false)
  }, [])

  useEffect(() => {
    if (bridgeAsset.amount > 0 && !submitReady) setSubmitReady(true);
  }, [bridgeAsset, submitReady]);

  return (
    <div className={`modal w-[690px] font-sfpro ${props.example == "swap" ? "my-8" : "my-12"}`}>

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

      <div className="text-[#101828] font-semibold text-xl">{BridgeModalConfig.title}</div>
      <div className="text-[#667085] text-sm mt-1 mb-10 ">{BridgeModalConfig.description}</div>

      {props.example == "bridge" && (
        <BridgeForm 
            fromNetwork={fromNetwork} setFromNetwork={setFromNetwork}
            toNetwork={toNetwork} setToNetwork={setToNetwork}
            bridgeAsset={bridgeAsset} setBridgeAsset={setBridgeAsset}
        />
      )}



      <PaymentMethod token={paymentToken} setToken={setPaymentToken}/>


      
      <div className="flex flex-col mt-10 w-full justify-start">
        <div className="font-semibold text-base">Transaction Details</div>
        <div className="flex justify-between w-full  text-sm mt-3">
          <div className="text-[#344054] font-medium">Estimated Time</div>
          <div className="text-[#667085]">{`~3 minutes`}</div>
        </div>
        <div className="flex justify-between w-full mt-3 text-sm">
          <div className="text-[#344054] font-medium">Gas</div>
          <div className="text-[#667085]">{`${gas}`}</div>
        </div>
      </div>


      <div className="flex w-full items-center justify-between mt-10 text-center">

        <div className="w-[315px] button p-3 font-medium text-[#344054]" onClick={() => router.push("/")}>Cancel</div>
        <div 
          className="w-[315px] button-dark p-3 font-medium flex items-center justify-center"
          onClick={handleSubmit}
          style={ (!submitReady || submitting) ? { opacity: 0.8, pointerEvents: "none" } : {}}
        >
          <div className={submitting ? "mr-2" : ""}>{BridgeModalConfig.submit}</div>
          {submitting && (
            <Spinner/>
          )}
        </div>

      </div>

    </div>
  )
}
