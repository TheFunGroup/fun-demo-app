import { ethers } from "ethers";

//Amount is in USDC
export const handleApprove = async function (wallet, auth, paymasterAddress, paymentAddr, amount=500) {

  console.log(wallet)
  console.log(auth);
  console.log(paymasterAddress);
  console.log(paymentAddr);
  console.log(amount)
  
  await wallet.approve(auth, { spender: paymasterAddress, token: paymentAddr, amount: amount })

  return { success: true }

}