import { ethers } from "ethers";
import { FunWallet, FunWalletConfig } from "@fun-wallet/sdk";

export const handleSwap = async function(wallet, paymentToken, swapData){
  console.log("SWAP")
  console.log(wallet);
  console.log(paymentToken)
  console.log(swapData.token1);
  console.log(swapData.amount)
  console.log(swapData.token2);

  //Tells frontend swap was success
  return {success: true, explorerUrl: "https://goerli.etherscan.io/tx/"} 

  //Tells frontend that funwallet must be funded
  // return {mustFund: true} 

}