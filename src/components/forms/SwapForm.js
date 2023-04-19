import { useEffect, useRef } from "react";
import Image from 'next/image';
import { getSwapAmount } from "../../scripts/prices";
import Input from "./Input";

export default function SwapForm(props) {

  const {
    swapExchange, setSwapExchange,
    swapReceive, setSwapReceive,
    slippage, setSlippage,
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
    if((from.name == "ETH" && amount > 0.01) || amount > 100 || amount < 0) return;
    setSwapExchange([amount, from])
    const swapAmount = await getSwapAmount(from, amount, to);
    setSwapReceive([swapAmount, to])
  }

  async function handleReceiveChange(amount, from, to){
    if((to.name == "ETH" && amount > 0.01) || amount > 100 || amount < 0) return;
    setSwapReceive([amount, to])
    const swapAmount = await getSwapAmount(swapReceive[1], amount, from);
    setSwapExchange([swapAmount, from])
  }

  return (
    <div className="w-full">

      <div className="w-full flex items-center mb-4">
        <Input 
          className="w-[287px]" 
          label="Slippage %"
          placeholder="0.30"
          type="number"
          value={slippage}
          onChange={(e) => {setSlippage(e.target.value)}}
        />
      </div>

      <div className="w-full flex items-center justify-between">

        <Input 
          className="w-[287px]" 
          label="Exchange Quantity & Token"
          placeholder="0.00"
          type="number"
          value={swapExchange[0]}
          onChange={(e) => {handleSwapChange(e.target.value, swapExchange[1], swapReceive[1])}}
          inputRef={swapExchangeRef}
          tokenSelect
          token={swapExchange[1]}
          nonToken={swapReceive[1]}
          setToken={(value) => {
            setSwapExchange([swapExchange[0], value]);
            handleSwapChange(swapExchange[0], value, swapReceive[1]);
          }}
        />
        
        <Image className="mt-7 cursor-pointer" src="/switch.svg" width="20" height="20" onClick={handleSwitch} alt=""/>

        <Input 
          className="w-[287px]" 
          label="Quantity & Token to Receive"
          placeholder="0.00"
          type="number"
          value={swapReceive[0]}
          onChange={(e) => {handleReceiveChange(e.target.value, swapExchange[1], swapReceive[1])}}
          inputRef={swapReceiveRef}
          tokenSelect
          token={swapReceive[1]}
          nonToken={swapExchange[1]}
          setToken={(value) => {
            setSwapReceive([swapReceive[0], value]);
            handleSwapChange(swapExchange[0], swapExchange[1], value)
          }}
        />
      </div>
    </div>
  )
}
