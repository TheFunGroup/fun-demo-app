import { ethers } from "ethers";

//Amount is in USDC
export const handleApprove = async function(wallet, amount, token){
  console.log("Approve token sponsor")
  console.log(wallet);
  console.log(amount);
  console.log(token)
  //Tells frontend that fund was success
  return {success: true} 

}