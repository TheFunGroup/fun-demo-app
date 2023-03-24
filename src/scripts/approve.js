import { ethers } from "ethers";
import { FunWallet, FunWalletConfig } from "@fun-wallet/sdk/wallet/index";

//Amount is in USDC
export const handleApprove = async function(wallet, amount){
  console.log("Approve")
  console.log(wallet);
  console.log(amount);

  //Tells frontend that fund was success
  return {success: true} 

}