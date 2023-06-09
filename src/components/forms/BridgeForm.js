import { useEffect, useRef } from "react";
import { getSwapAmount } from "../../scripts/prices";
import Input from "./Input";
import NetworkSelect from "./NetworkSelect";
import { tokens } from "../../utils/tokens";

const setNetwork = (newNetwork, network, otherNetwork, setNetwork, setOtherNetwork) => {
    if (newNetwork == otherNetwork) {
        setOtherNetwork(network)
        setNetwork(newNetwork)
        return;
    }
    setNetwork(newNetwork);
};


const shouldResetToken = (network, token) => {
  if (tokens[network] == null) return false;
  for (let i = 0; i < tokens[network].length; i++) {
    if (tokens[network][i].name == token.name) return false;
  }
  return true;
}

export default function BridgeForm(props) {

  const {
    fromNetwork, setFromNetwork,
    toNetwork, setToNetwork,
    bridgeAsset, setBridgeAsset,
    bridgeOutAsset, setBridgeOutAsset,

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
            if (shouldResetToken(val, bridgeAsset)) {
              setBridgeAsset({name: tokens[val][0].name, amount: bridgeAsset.amount})
            }
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
      <div className="w-full flex items-center justify-between mt-6">
      <Input 
          className="w-[304px]" 
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
            setBridgeAsset({...bridgeAsset, name:value.name, amount: bridgeAsset.amount})
          }}
          network={fromNetwork}
          balance={bridgeAsset.balance}
        />
        <Input 
          className="w-[304px]" 
          label="Amount & Token to Bridge"
          placeholder="0.00"
          type="number"
          width="80%"
          value={bridgeOutAsset.amount}
          onChange={(e) => {setBridgeOutAsset({...bridgeOutAsset, amount: e.target.value})}}
          inputRef={swapReceiveRef}
          tokenSelect
          token={bridgeOutAsset}
          nonToken={bridgeOutAsset}
          setToken={(value) => {
            setBridgeOutAsset({...bridgeOutAsset, name:value.name, amount: bridgeOutAsset.amount})
          }}
          network={toNetwork}
          balance={bridgeOutAsset.balance}
        />
      </div>

    </div>
  )
}
