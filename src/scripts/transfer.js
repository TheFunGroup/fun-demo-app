import { ethers } from "ethers";
import { configureEnvironment } from "fun-wallet/managers";
import { TokenSponsor } from "fun-wallet/sponsors";
import { Token } from "fun-wallet/data";
import { tokens } from "../utils/tokens"
import erc20ABI from "../utils/funTokenAbi.json";
import { isContract } from "./wallet";
import { apiKey } from "../utils/constants";
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

    if (paymentToken != "ETH" && paymentToken != "gasless") { //use paymaster
      await configureEnvironment({
        chain: 5,
        apiKey,
        gasSponsor: {
          sponsorAddress: '0x07Ac5A221e5b3263ad0E04aBa6076B795A91aef9',
          token: paymentaddr
        }
      })

      const gasSponsor = new TokenSponsor()
      const paymasterAddress = await gasSponsor.getPaymasterAddress()
      const erc20Contract = new ethers.Contract(paymentaddr, erc20ABI.abi, provider)

      const iscontract = await isContract(walletAddress)
      if (iscontract) {
        let allowance = await erc20Contract.allowance(walletAddress, paymasterAddress)//paymaster address
        allowance = ethers.utils.formatUnits(allowance, 6);
        if (Number(allowance) < Number(20)) {//amt
          //if approved, pop up modal, and ask for approval
          return { success: false, mustApprove: true, paymasterAddress, tokenAddr: paymentaddr }
        }
      } else {
        alert("Its a known bug that first transaction of a fun wallet would fail if you are covering gas using ERC20 tokens. Please try to pay gas using gasless paymaster or ETH for this transaction and try token paymaster later.")
        return { success: false, error: "do not use ERC20 token to pay for gas for first transaction of a fun wallet" }
      }
    }
    else if (paymentToken == "gasless") {
      console.log('using gasless')
      await configureEnvironment({
        chain: 5,
        apiKey,
        gasSponsor: {
          sponsorAddress: '0x07Ac5A221e5b3263ad0E04aBa6076B795A91aef9',
        }
      })
    }
    else {
      await configureEnvironment({
        chain: 5,
        apiKey,
        gasSponsor: false
      })
    }

    if (transferData.token.name != "ETH") {
      const receipt = await wallet.transfer(auth, { to: transferData.to, amount: transferData.amount, token: tokenaddr })
      console.log("txId: ", receipt.txid)
      const explorerUrl = receipt.txid ? `https://goerli.etherscan.io/tx/${receipt.txid}` : `https://goerli.etherscan.io/address/${walletAddress}#internaltx`
      return { success: true, explorerUrl }
    }
    else {
      const receipt = await wallet.transfer(auth, { to: transferData.to, amount: transferData.amount })
      console.log("txId: ", receipt.txid)
      const explorerUrl = receipt.txid ? `https://goerli.etherscan.io/tx/${receipt.txid}` : `https://goerli.etherscan.io/address/${walletAddress}#internaltx`
      return { success: true, explorerUrl }
    }
  } catch (e) {
    console.log(e)
    return { success: false, error: e }
  }
}

