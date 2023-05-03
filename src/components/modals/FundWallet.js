import { useState } from "react";
import Image from 'next/image';
import { handleFundWallet } from "../../scripts/fund";
import { useFun } from "../../contexts/funContext";
import { useRouter } from "next/router";
import Spinner from "../misc/Spinner";

export default function FundWallet(props) {

  const router = useRouter();
  const [funding, setFunding] = useState(false)
  const { wallet, setLoading } = useFun()

  function fundWallet(){
    if(funding) return;
    setFunding(true);
    setLoading(true)
    handleFundWallet(wallet.address).then(() => {
      if(router.query.example){
        router.push(`/${router.query.example}`)
      } else {
        router.push('/')
      }
      setFunding(false);
      setLoading(false);
    })
  }

  return (
    <div className="modal w-[512px] my-12">
      <div className="text-[#101828] font-semibold text-xl">Fund your Fun Wallet</div>
      <div className="text-[#667085] text-sm mt-1 whitespace-nowrap">Add test network tokens to your wallet to complete transactions.</div>
      <div className="w-full mt-2 text-sm text-[#667085]">
        <div className="flex items-center justify-between">
          <div className="">Receive 0.15 ETH</div>
          <div className="">Receive 1000 USDC</div>
        </div>
        <div className="flex items-center justify-between mt-1">
          <div className="">Receive 1000 DAI</div>
          <div className="">Receive 1000 USTC</div>
        </div>
      </div>

      <div className="w-full flex items-center justify-center mt-4">
        
        <div className="w-[175px] text-center button p-3 font-medium text-[#344054] mr-3" onClick={() => router.push("/")}>Cancel</div>

        <div 
          className="w-[300px] button w-full rounded-lg border-[#D0D5DD] border-[1px] bg-white flex justify-center cursor-pointer py-[10px] px-4"
          onClick={() => fundWallet()}
          style={ funding ? { opacity: 0.8, pointerEvents: "none" } : {}}
        > 
          {funding && (
            <Spinner />
          )}
          {!funding && (
            <Image src="/wallet.svg" width="22" height="22" alt=""/>
          )}
          <div 
            className="ml-3 font-medium text-[#344054]"
          >Fund Wallet</div>
        </div>
      </div>

    </div>
  )
}
