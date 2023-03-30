import { ethers } from "ethers";
import { configureEnvironment } from "@fun-wallet/sdk/managers"
import { TokenSponsor } from "@fun-wallet/sdk/sponsors"
import { Token } from "@fun-wallet/sdk/data/"
import { tokens } from "../utils/tokens"
import erc20ABI from "../utils/funTokenAbi.json";
import { isContract } from "../utils/utils"
export const handleTransfer = async function (wallet, paymentToken, transferData, auth) {

  try {
    if (!transferData.to) {
      alert("No Receiver Address Specified")
      return { success: false }
    }
    const walletAddress = await wallet.getAddress()
    let tokenaddr = "eth"
    let paymentaddr = ""
    for (let i of tokens["5"]) {
      if (i.name == transferData.token.name && transferData.token.name != "ETH") {
        tokenaddr = i.addr
      }
      if (i.name == paymentToken && paymentToken != "ETH") {
        paymentaddr = i.addr
      }
    }

    let balance = 0;
    const provider = new ethers.providers.JsonRpcProvider("https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161");
    if (transferData.token.name == "ETH") {
      balance = await provider.getBalance(walletAddress);
      balance = ethers.utils.formatEther(balance);
    }
    else {
      balance = (await Token.getBalance(tokenaddr, walletAddress))
    }
    if (Number(balance) < Number(transferData.amount) || Number(balance) < Number(.1)) {
      return { success: false, mustFund: true }
    }

    const funderAddress = await auth.getUniqueId()
    const funder = auth
    if (paymentToken != "ETH") { //use paymaster
      await configureEnvironment({
        chain: 5,
        apiKey: "hnHevQR0y394nBprGrvNx4HgoZHUwMet5mXTOBhf",
        gasSponsor: {
          sponsorAddress: funderAddress,
          token: paymentaddr
        }
      })

      const gasSponsor = new TokenSponsor()
      const paymasterAddress = await gasSponsor.getPaymasterAddress()
      console.log("Paymaster", paymasterAddress)
      console.log(erc20ABI)
      const erc20Contract = new ethers.Contract(paymentaddr, erc20ABI.abi, provider)

      const iscontract = await isContract(walletAddress, provider)
      console.log(iscontract)
      if (iscontract) {
        let allowance = await erc20Contract.allowance(walletAddress, paymasterAddress)//paymaster address
        allowance = ethers.utils.formatUnits(allowance, 6);
        console.log("ALLOWANCE", allowance)
        if (Number(allowance) < Number(5)) {//amt
          //if approved, pop up modal, and ask for approval
          return { success: false, mustApprove: true, paymasterAddress, tokenAddr: paymentaddr }
        }
      }



      // const approve = await gasSponsor.approve(paymentaddr, ercStakeAmount)

      // await wallet.approve(auth,{spender: paymasterAddress, token: paymentaddr, amount: 10})
    }
    else {
      await configureEnvironment({
        chain: 5,
        apiKey: "hnHevQR0y394nBprGrvNx4HgoZHUwMet5mXTOBhf",
        gasSponsor: false
      })
    }

    if (transferData.token.name != "ETH") {
      console.log("Transfering ERC")
      const receipt = await wallet.transfer(auth, { to: transferData.to, amount: transferData.amount, token: tokenaddr })
      console.log(receipt)
      return { success: true, explorerUrl: `https://goerli.etherscan.io/tx/${receipt.txid}` }
    }
    else {
      const receipt = await wallet.transfer(auth, { to: transferData.to, amount: transferData.amount })
      console.log(receipt)
      return { success: true, explorerUrl: `https://goerli.etherscan.io/tx/${receipt.txid}` }
    }
  } catch (e) {
    console.log(e)
    return { success: false, error: e }
  }
}

