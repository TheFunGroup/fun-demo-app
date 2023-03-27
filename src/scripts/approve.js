import { ethers } from "ethers";

//Amount is in USDC
export const handleApprove = async function(wallet, amount){
  console.log("Approve")
  console.log(wallet);
  console.log(amount);

  //Tells frontend that fund was success
  return {success: true} 

}