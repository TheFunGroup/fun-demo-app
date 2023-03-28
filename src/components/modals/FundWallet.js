import { useEffect, useState, useRef } from "react";
import Image from 'next/image';
import { ethers } from "ethers";
import TokenSelect from "../forms/TokenSelect";
import { handleFundWallet } from "../../scripts/fund";
import { useFun } from "../../contexts/funContext";

export default function FundWallet(props) {

  const router = useRouter();
  const [funding, setFunding] = useState(["20"]);
  const { wallet } useFun()

  function fundWallet(){
    handleFundWallet(wallet, funding).then((data) => {
      router.push('/')
    })
  }

  return (
    <div className="modal w-[512px] my-12">
      <div className="text-[#101828] font-semibold text-xl">Fund your Fun Wallet</div>
      <div className="text-[#667085] text-sm mt-1 whitespace-nowrap">Add tokens to your wallet for transaction fees.</div>
      <div className="w-full mt-6 flex items-center justify-between">
        <div className="w-full">
          <div className="text-[#344054] text-sm font-medium mb-[6px]">Amount</div>
          <div 
            className="w-full flex items-center justify-between border-[1px] border-[#D0D5DD] px-[14px] py-[10px] rounded-lg bg-white"
          >
            <input 
              className="border-0 outline-0 w-full text-[#667085]" placeholder="0.00" type="number" value={funding}
              onChange={(e) => {setFunding(e.target.value)}}
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

      <div 
        className="button mt-8 w-full rounded-lg border-[#D0D5DD] border-[1px] bg-white flex justify-center cursor-pointer py-[10px] px-4"
        onClick={fundWallet}
      >
        <Image src="/wallet.svg" width="22" height="22" alt=""/>
        <div className="ml-3 font-medium text-[#344054]">Fund Wallet</div>
      </div>

    </div>
  )
}
