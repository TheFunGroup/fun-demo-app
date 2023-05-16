import { useEffect, useRef } from "react";
import { getSwapAmount } from "../../scripts/prices";
import Input from "./Input";
import NetworkSelect from "./NetworkSelect";

const setNetwork = (newNetwork, network, otherNetwork, setNetwork, setOtherNetwork) => {
    if (newNetwork == otherNetwork) {
        setOtherNetwork(network)
        setNetwork(newNetwork)
        return;
    }
    setNetwork(newNetwork);
};


export default function BridgeForm(props) {

  const {
    fromNetwork, setFromNetwork,
    toNetwork, setToNetwork,
    bridgeAsset, setBridgeAsset,

  } = props;

  const swapReceiveRef = useRef();


  return (
    <div className="w-full">


      <div className="w-full flex items-center justify-between">
        <NetworkSelect 
          className="w-[304px]" 
          label="From this network"
          network={fromNetwork}
          setNetwork={(val) => {
            setNetwork(val, fromNetwork, toNetwork, setFromNetwork, setToNetwork)
          }}

        />
        

        <NetworkSelect 
          className="w-[304px]" 
          label="To this network"
          network={toNetwork}
          setNetwork={(val) => {
            setNetwork(val, toNetwork, fromNetwork, setToNetwork, setFromNetwork)
          }}
        />
      </div>
      <div className="w-full flex items-center mt-6">
      <Input 
          className="w-full" 
          label="Amount & Token to Bridge"
          placeholder="0.00"
          type="number"
          width="80%"
          value={bridgeAsset.amount}
          onChange={(e) => {setBridgeAsset({...bridgeAsset, amount: e.target.value})}}
          inputRef={swapReceiveRef}
          tokenSelect
          token={bridgeAsset}
          nonToken={bridgeAsset}
          setToken={(value) => {
            setBridgeAsset({name:value.name, amount: bridgeAsset.amount})
          }}
          balance={bridgeAsset.balance}
        />
      </div>

    </div>
  )
}
