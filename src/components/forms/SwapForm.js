import { useEffect, useState, useRef } from "react";
import Image from 'next/image';
import { networks,  connectToNetwork } from "../../utils/networks";
import { tokens } from "../../utils/tokens";
import TokenSelect from "./TokenSelect";
import { getSwapAmount } from "../../scripts/prices";

import { useOnClickOutside } from "../../hooks/useOnClickOutside";

export default function SwapForm(props) {

  const {
    swapExchange, setSwapExchange,
    swapReceive, setSwapReceive,
    slippage, setSlippage,
    network, wallet
  } = props;

  const swapExchangeRef = useRef();
  const swapReceiveRef = useRef();

  function handleSwitch(){
    const temp = [...swapExchange]
    setSwapExchange(swapReceive);
    setSwapReceive(temp);
  }

  useEffect(() => {
    getSwapAmount(swapExchange[1], swapExchange[0], swapReceive[1]).then((swapAmount) => {
      setSwapReceive([swapAmount, swapReceive[1]])
    });
  }, [])

  async function handleSwapChange(amount, from, to){
    setSwapExchange([amount, from])
    const swapAmount = await getSwapAmount(from, amount, to);
    setSwapReceive([swapAmount, to])
  }

  async function handleReceiveChange(amount, from, to){
    setSwapReceive([amount, to])
    const swapAmount = await getSwapAmount(swapReceive[1], amount, from);
    setSwapExchange([swapAmount, from])
  }

  return (
    <div className="w-full">

      <div className="w-full flex items-center mb-4">
        <div className="w-[287px]">
          <div className="text-[#344054] text-sm font-medium mb-[6px]">Slippage %</div>
          <div 
            className="w-full flex items-center justify-between border-[1px] border-[#D0D5DD] px-[14px] py-[10px] rounded-lg bg-white"
          >
            <input 
              className="border-0 outline-0 w-full text-[#667085]" placeholder="0.30" type="number" value={`${slippage}`}
              onChange={(e) => {setSlippage(e.target.value)}}
            >
            </input>
          </div>
        </div>
      </div>

      <div className="w-full flex items-center justify-between">
        <div className="w-[287px]">
          <div className="text-[#344054] text-sm font-medium mb-[6px]">Exchange Quantity & Token</div>
          <div 
            className="w-full flex items-center justify-between border-[1px] border-[#D0D5DD] px-[14px] py-[10px] rounded-lg bg-white"
            // onClick={() => {swapExchangeRef?.current?.focus()}}
          >
            <input 
              className="border-0 outline-0 w-full text-[#667085]" placeholder="0.00" type="number" value={swapExchange[0]}
              onChange={(e) => {handleSwapChange(e.target.value, swapExchange[1], swapReceive[1])}}
              ref={swapExchangeRef}
            >
            </input>
            <TokenSelect token={swapExchange[1]} setToken={(value) => {
              setSwapExchange([swapExchange[0], value]);
              handleSwapChange(swapExchange[0], value, swapReceive[1]);
            }} network={network}/>
          </div>
        </div>
        
        <Image className="mt-7 cursor-pointer" src="/switch.svg" width="20" height="20" onClick={handleSwitch}/>

        <div className="w-[287px]">
          <div className="text-[#344054] text-sm font-medium mb-[6px]">Quantity & Token to Receive</div>
          <div 
            className="w-full flex items-center justify-between border-[1px] border-[#D0D5DD] px-[14px] py-[10px] rounded-lg bg-white"
          >
            <input 
              className="border-0 outline-0 w-full text-[#667085]" placeholder="0.00" type="number" value={swapReceive[0]}
              onChange={(e) => {handleReceiveChange(e.target.value)}}
              ref={swapReceiveRef}
            >
            </input>
            <TokenSelect token={swapReceive[1]} setToken={(value) => {
              setSwapReceive([swapReceive[0], value]);
              handleSwapChange(swapExchange[0], swapExchange[1], value)
            }} network={network}/>
          </div>
        </div>
      </div>
    </div>
  )
}
