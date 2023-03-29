import { useEffect, useState, useRef } from "react";
import Image from 'next/image';
import { ethers } from "ethers";
import TokenSelect from "../forms/TokenSelect";
import { handleFundWallet } from "../../scripts/fund";
import { useFun } from "../../contexts/funContext";
import { useRouter } from "next/router";
import Input from "../forms/Input";

export default function FundWallet(props) {

  const router = useRouter();
  const [funding, setFunding] = useState(["2", {name: "ETH"}]);
  const { wallet } = useFun()

  function fundWallet(){
    handleFundWallet(wallet, funding).then((data) => {
      router.push('/')
    })
  }

  return (
    <div className="modal w-[512px] my-12">
      <div className="text-[#101828] font-semibold text-xl">Fund your Fun Wallet</div>
      <div className="text-[#667085] text-sm mt-1 whitespace-nowrap">Add tokens to your wallet to complete transactions.</div>
      
      <Input 
        className="w-full mt-6" 
        label="Amount"
        placeholder="0.00"
        type="number"
        value={funding[0]}
        onChange={(e) => {setFunding([e.target.value, funding[1]])}}
        tokenSelect
        token={funding[1]}
        setToken={(value) => {setFunding([funding[0], value])}}
      />

      <div className="w-full flex items-center justify-center mt-4">
        
        <div className="w-[175px] text-center button p-3 font-medium text-[#344054] mr-3" onClick={() => router.push("/")}>Cancel</div>

        <div 
          className="w-[300px] button w-full rounded-lg border-[#D0D5DD] border-[1px] bg-white flex justify-center cursor-pointer py-[10px] px-4"
          
        >
          <Image src="/wallet.svg" width="22" height="22" alt=""/>
          <div className="ml-3 font-medium text-[#344054]" onClick={fundWallet}>Fund Wallet</div>
        </div>
      </div>

      

    </div>
  )
}
