import { ethers } from "ethers";
import { toUSD } from "./prices";

export const calculateGas = async function(paymentToken, wallet, swapData, transferData){

  if(swapData){
    // console.log(swapData.token1);
    // console.log(swapData.amount)
    // console.log(swapData.token2);
  } else if(transferData){
    // console.log(transferData.token);
    // console.log(transferData.amount)
    // console.log(transferData.to);
  }

  const gas = 0.0056;  //hardcode
  const usd = await toUSD(paymentToken, gas)

  return {
    token: gas,
    usd
  }

}