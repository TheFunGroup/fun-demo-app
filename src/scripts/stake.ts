import { ethers } from "ethers";
const Big  = ethers.BigNumber
import { configureEnvironment } from "fun-wallet/managers";
import { TokenSponsor } from "fun-wallet/sponsors";
import type { FunWallet, } from "fun-wallet";
import erc20ABI from "../utils/funTokenAbi.json";
import { isContract } from "./wallet";
import { apiKey } from "../utils/constants";

// requires
// Wallet funWallet
// paymentToken String (ETH, gassless, etc)
// amount string WEI amount to stake
// auth Object or EOA signer specifically.
export const handleStakeEth = async function (wallet: FunWallet, paymentToken: string, amount: string, auth) {
  try {
    const provider = new ethers.providers.JsonRpcProvider("https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161");
    const walletAddress = await wallet.getAddress()
    const chainId = await wallet.network
    let balanceWEI = await provider.getBalance(walletAddress);

    let inAddr = ""
    let outAddr = ""
    let paymentaddr = ""

    // validate the params
    if (typeof amount !== "string") return { success: false, error: "Amount must be a Number of type String" };
    if (Big.from(amount) <= Big.from(0)) return { success: false, error: "Staking amount must be greater than 0"};
    if (Big.from(amount) < balanceWEI) return { success: false, error: "Staking amount cannot exceed your account balance" };

    
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
    try {
      const receipt = await wallet.stake(auth, {amount});
    //Tells frontend stake was success
    console.log("txId: ", receipt.txid)
    const explorerUrl = receipt.txid ? `https://goerli.etherscan.io/tx/${receipt.txid}` : `https://goerli.etherscan.io/address/${walletAddress}#internaltx`
    return { success: true, explorerUrl}


    } catch (err) {
      return { success: false, error: err.toString() }
    }



  } catch (e) {
    console.log(e)
    return { success: false, error: e.toString() }
  }

}