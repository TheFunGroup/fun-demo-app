import { useEffect, useState, useRef } from "react";
import Image from 'next/image';
import { networks,  connectToNetwork } from "../../utils/networks";
import { tokens } from "../../utils/tokens";

import { useOnClickOutside } from "../../hooks/useOnClickOutside";
import { useFun } from "../../contexts/funContext";

export default function PaymentMethod(props) {

  const { token, setToken } = props;
  const { network } = useFun()

  const chainToken = networks[network || 5].nativeCurrency;

  return (
    <div className="w-full mt-10">
      <div className="text-[#101828] font-semibold">Payment Method</div>
      <div 
        className="button flex justify-between items-center w-full p-4 text-[#344054] font-medium mt-3"
        style={{background: token !== chainToken.symbol ? "#2D4EA214" : "", borderColor: token !== chainToken.symbol ? "#2D4EA2" : "#E4E7EC"}}
        onClick={() => {if(token == chainToken.symbol) setToken("USDC")}}
      >
        <div className="flex items-center">
          <Image src="/erc20-payment.png" width="46" height="32" alt=""/>
          <div className="ml-4">ERC-20 Tokens</div>
        </div>
        <Image src={token !== chainToken.symbol ? "/checked.svg" : "/uncheck.svg"} width="20" height="20"  alt=""/>
      </div>

      {token !== chainToken.symbol && (
        <div className="flex items-center mt-3 w-full pb-1 pl-4">
          <div 
            className="button justify-center flex py-1 px-[10px] text-[#344054] font-medium mr-2 text-sm"
            style={{background: token == "USDC" ? "#2D4EA214" : "", borderColor: token == "USDC" ? "#2D4EA2" : "#E4E7EC"}}
            onClick={() => setToken("USDC")}
          >
            <Image src="/usdc.svg" width="16" height="16"  alt=""/>
            <div className="ml-[6px]">USDC</div>
          </div>
          <div 
            className="button items-center justify-center flex py-1 px-[10px] text-[#344054] font-medium mr-2 text-sm"
            style={{background: token == "DAI" ? "#2D4EA214" : "", borderColor: token == "DAI" ? "#2D4EA2" : "#E4E7EC"}}
            onClick={() => setToken("DAI")}
          >
            <Image src="/dai.svg" width="16" height="16"  alt=""/>
            <div className="ml-[6px]">DAI</div>
          </div>
          <div 
            className="button justify-center flex py-1 px-[10px] text-[#344054] font-medium mr-2 text-sm"
            style={{background: token == "USDT" ? "#2D4EA214" : "", borderColor: token == "USDT" ? "#2D4EA2" : "#E4E7EC"}}
            onClick={() => setToken("USDT")}
          >
            <Image src="/usdt.svg" width="16" height="16"  alt=""/>
            <div className="ml-[6px]">USDT</div>
          </div>
        </div>
      )}

      <div 
        className="button flex justify-between items-center w-full p-4 text-[#344054] font-medium mt-3"
        style={{background: token == chainToken.symbol ? "#2D4EA214" : "", borderColor: token == chainToken.symbol ? "#2D4EA2" : "#E4E7EC"}}
        onClick={() => {setToken(chainToken.symbol)}}
      >
        <div className="flex items-center">
          <Image src={network == '5' ?  "/ethereum-payment.png" : "/matic-payment.png"} width="46" height="32" alt=""/>
          <div className="ml-4">{chainToken.name}</div>
        </div>
        <Image src={token == chainToken.symbol ? "/checked.svg" : "/uncheck.svg"} width="20" height="20" alt=""/>
      </div>
    </div>
  )
}
