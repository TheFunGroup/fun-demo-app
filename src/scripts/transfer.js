import { ethers } from "ethers";
import { FunWallet, FunWalletConfig } from "@fun-wallet/sdk";

export const handleTransfer = async function(wallet, paymentToken, transferData){
  console.log("TRANSFER")
  console.log(wallet);
  console.log(paymentToken)
  console.log(transferData.token);
  console.log(transferData.amount)
  console.log(transferData.to);

  //Tells frontend that transfer was success
  return {success: true, explorerUrl: "https://goerli.etherscan.io/tx/"} 

  //Tells frontend that funwallet must be funded  
  return {mustFund: true} 

}