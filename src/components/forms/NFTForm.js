import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useFun } from "../../contexts/funContext";

export default function NFTForm(props) {

  const nft = props.nft;
  const {wallet} = useFun();

  return (
    <div className="w-full flex items-center">

      <div className="flex items-center mr-4">
        <img width="40" height="40" className="rounded-lg mr-3" src={`/nft${nft}.png`}/>
        <div className="text-[#101828] font-semibold">{`NFT #000${nft}`}</div>
      </div>
      <Image width="24" height="24" src="/right.svg" alt=""/>
      <div className="flex items-center ml-4">
        <img width="40" height="40" className="rounded-full mr-3" src={`/profile.svg`}/>
        <div>
          <div className="text-[#101828] font-semibold">{`Fun Wallet`}</div>
          <div className="text-[#667085] text-sm truncate max-w-[180px]">{wallet?.address || "0x25b3838A3947c6dA459y4y945y45485yvn459t4t28B"}</div>
        </div>
      </div>

    </div>
  )
}
