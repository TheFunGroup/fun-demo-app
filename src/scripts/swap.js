import { ethers } from "ethers";
import { configureEnvironment } from "@fun-wallet/sdk/managers"
import { TokenSponsor } from "@fun-wallet/sdk/sponsors"
import { Token } from "@fun-wallet/sdk/data/"
import { formatUnits } from "ethers/lib/utils.js";
import { tokens } from "../utils/tokens"
import erc20ABI from "../utils/funTokenAbi.json";
import { isContract } from "../utils/utils"

export const handleSwap = async function (wallet, paymentToken, swapData, auth) {
  try {
    const walletAddress = await wallet.getAddress()
    let inAddr = ""
    let outAddr = ""
    let paymentaddr = ""
    for (let i of tokens["5"]) {
      if (i.name == swapData.token1.name) {
        inAddr = i.addr
      }
      if (i.name == swapData.token2.name) {
        outAddr = i.addr
      }
      if (i.name == paymentToken && paymentToken != "ETH") {
        paymentaddr = i.addr
      }
    }

    const ins = swapData.token1.name.toLowerCase()
    const out = swapData.token2.name.toLowerCase()
    const provider = new ethers.providers.JsonRpcProvider("https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161");

    let balance = 0;
    if (ins == "eth") {
      balance = await provider.getBalance(walletAddress);
      balance = ethers.utils.formatEther(balance);
    }
    else {
      balance = (await Token.getBalance(inAddr, walletAddress))
    }

    if (balance < swapData.amount) {
      return { success: false, mustFund: true }
    }
    // // Tells frontend that funwallet must be funded  
    // return {mustFund: true} 
    const funderAddress = await auth.getUniqueId()
    const funder = auth
    if (paymentToken != "ETH") { //use paymaster
      await configureEnvironment({
        chain: 5,
        apiKey: "hnHevQR0y394nBprGrvNx4HgoZHUwMet5mXTOBhf",
        gasSponsor: {
          sponsorAddress: "0x175C5611402815Eba550Dad16abd2ac366a63329",
          token: paymentaddr
        }
      })

      const gasSponsor = new TokenSponsor()

      const paymasterAddress = await gasSponsor.getPaymasterAddress()
      const iscontract = await isContract(walletAddress, provider)
      if (iscontract) {
        const erc20Contract = new ethers.Contract(paymentaddr, erc20ABI.abi, provider)
        let allowance = await erc20Contract.allowance(walletAddress, paymasterAddress)//paymaster address
        allowance = ethers.utils.formatUnits(allowance, 6);

        if (Number(allowance) < Number(5)) {//amt
          //if approved, pop up modal, and ask for approval
          return { success: false, mustApprove: true, paymasterAddress, tokenAddr: paymentaddr }

        }
      }


    }
    else {
      await configureEnvironment({
        chain: 5,
        apiKey: "hnHevQR0y394nBprGrvNx4HgoZHUwMet5mXTOBhf",
        gasSponsor: false
      })
    }
    console.log(ins)
    const receipt = await wallet.swap(auth, {
      in: ins == "eth" ? "eth" : inAddr,
      amount: swapData.amount,
      out: out == "eth" ? "eth" : outAddr
    })

    //Tells frontend swap was success
    return { success: true, explorerUrl: `https://goerli.etherscan.io/tx/${receipt.txid}` }


  } catch (e) {
    console.log(e)
    return { success: false, error: e }
  }

}

const logTokenBalanceSponsor = async (sponsor, token, spender) => {
  const tokenBalance = await sponsor.getTokenBalance(token, spender)
  console.log(formatUnits(tokenBalance.toString(), 18))
}
