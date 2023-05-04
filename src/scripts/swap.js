import { ethers } from "ethers";
import { configureEnvironment } from "fun-wallet/managers";
import { TokenSponsor } from "fun-wallet/sponsors";
import { Token } from "fun-wallet/data";
import { tokens } from "../utils/tokens"
import erc20ABI from "../utils/funTokenAbi.json";
import { isContract } from "./wallet";
import { apiKey } from "../utils/constants";

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
    if (paymentToken != "ETH" && paymentToken != "gasless") { //use paymaster
      await configureEnvironment({
        chain: 5,
        apiKey,
        gasSponsor: {
          sponsorAddress: "0x07Ac5A221e5b3263ad0E04aBa6076B795A91aef9",
          token: paymentaddr
        }
      })

      const gasSponsor = new TokenSponsor()

      const paymasterAddress = await gasSponsor.getPaymasterAddress()
      const iscontract = await isContract(walletAddress)
      if (iscontract) {
        const erc20Contract = new ethers.Contract(paymentaddr, erc20ABI.abi, provider)
        let allowance = await erc20Contract.allowance(walletAddress, paymasterAddress)//paymaster address
        allowance = ethers.utils.formatUnits(allowance, 6);

        if (Number(allowance) < Number(20)) {//amt
          //if approved, pop up modal, and ask for approval
          return { success: false, mustApprove: true, paymasterAddress, tokenAddr: paymentaddr }

        }
      } else {
        return { success: false, error: "Its a known bug that first transaction of a fun wallet would fail if you are covering gas using ERC20 tokens. Please try to pay gas using gasless paymaster or ETH for this transaction and try token paymaster later." }
      }
    }
    else if(paymentToken=="gasless"){
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
    const receipt = await wallet.swap(auth, {
      in: ins == "eth" ? "eth" : inAddr,
      amount: swapData.amount,
      out: out == "eth" ? "eth" : outAddr
    })

    //Tells frontend swap was success
    console.log("txId: ", receipt.txid)
    const explorerUrl = receipt.txid ? `https://goerli.etherscan.io/tx/${receipt.txid}` : `https://goerli.etherscan.io/address/${walletAddress}#internaltx`
    return { success: true, explorerUrl}


  } catch (e) {
    console.log(e)
    return { success: false, error: e.toString() }
  }

}