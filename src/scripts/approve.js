import { ethers } from "ethers";

//Amount is in USDC
export const handleApprove = async function (wallet, amount = 100, token) {
  
  await wallet.approve(auth, { spender: paymasterAddress, token: paymentaddr, amount: amount })

  return { success: true }

}