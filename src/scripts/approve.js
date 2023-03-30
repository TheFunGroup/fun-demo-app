import { ethers } from "ethers";

//Amount is in USDC
export const handleApprove = async function (wallet, auth, paymasterAddress, paymentAddr, amount=500) {
  
  await wallet.approve(auth, { spender: paymasterAddress, token: paymentAddr, amount: amount })

  return { success: true }

}