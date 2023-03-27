import { ethers } from "ethers";

//Amount is in USDC
export const handleFundWallet = async function(wallet, amount){
  console.log("FUND WALLET")
  console.log(wallet);
  console.log(amount);

  //Tells frontend that fund was success
  return {success: true} 

}