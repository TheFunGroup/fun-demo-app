import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Image from 'next/image';
import { ethers } from "ethers";
import TokenSelect from "../forms/TokenSelect";
import { handleApprove } from "../../scripts/approve";
import { useFun } from "../../contexts/funContext";
import Input from "../forms/Input";

export default function ApprovePM(props) {

  const router = useRouter();
  const [amount, setAmount] = useState(["1000000.00"]);
  const { wallet, paymentToken } = useFun()

  function approve(){
    handleApprove(wallet, amount, paymentToken, setPaymentToken).then((data) => {
      router.push("/")
    })
  }

  return (
    <div className="modal w-[512px] my-12">
      <div className="text-[#101828] font-semibold text-xl">Give permission to pay for gas</div>
      <div className="text-[#667085] text-sm mt-1 whitespace-nowrap">Give Fun access to tokens to pay gas fees.</div>
      <div className="w-full mt-6 flex items-center justify-between">
        
        <Input 
          className="w-full" 
          label="Amount"
          placeholder="0.00"
          type="number"
          value={amount}
          onChange={(e) => {setAmount(e.target.value)}}
          tokenSelect
          token={{name :paymentToken}}
          setToken={(value) => {setPaymentToken(value.name)}}
        />
       
      </div>

      <div className="flex w-full items-center justify-between mt-10 text-center">

        <div className="w-[224px] button p-3 font-medium text-[#344054]" onClick={() => router.push("/")}>Cancel</div>
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
