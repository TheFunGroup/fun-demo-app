import { ethers } from "ethers";

//Amount is in USDC
export const handleApprove = async function (auth, paymasterAddress, paymentAddr, amount=500) {

  console.log(auth);
  console.log(paymasterAddress);
  console.log(paymentAddr);
  console.log(amount)
  
  await wallet.approve(auth, { spender: paymasterAddress, token: paymentAddr, amount: amount })

  return { success: true }

}