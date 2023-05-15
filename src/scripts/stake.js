import { BigNumber, ethers } from "ethers";
const Big  = ethers.BigNumber
import { configureEnvironment } from "../../fun-wallet/managers";
import { TokenSponsor } from "../../fun-wallet/sponsors";
import erc20ABI from "../utils/funTokenAbi.json";
import { isContract } from "./wallet";
import { apiKey } from "../utils/constants";
import { formatEther, parseEther } from "ethers/lib/utils.js";

// requires
// Wallet funWallet
// paymentToken String (ETH, gassless, or address of ERC20 token)
// amount string ETH amount to stake
// auth Object or EOA signer specifically.
export const handleStakeEth = async function (wallet, paymentToken, amount, auth) {
  try {
    const provider = new ethers.providers.JsonRpcProvider("https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161");
    const walletAddress = await wallet.getAddress()
    let balanceWEI = await provider.getBalance(walletAddress);
    // validate the params
    if (parseFloat(amount) <= 0) return { success: false, error: "Staking amount must be greater than 0"};
    if (parseFloat(amount) > parseFloat(formatEther(balanceWEI))) return { success: false, error: "Staking amount cannot exceed your account balance" };

    
    // // Tells frontend that funwallet must be funded  
    if (paymentToken != "ETH" && paymentToken != "gasless") { //use paymaster
      await configureEnvironment({
        chain: 5,
        apiKey,
        gasSponsor: {
          sponsorAddress: "0x07Ac5A221e5b3263ad0E04aBa6076B795A91aef9",
          token: paymentToken
        }
      })

      const gasSponsor = new TokenSponsor()

      const paymasterAddress = await gasSponsor.getPaymasterAddress()
      const iscontract = await isContract(walletAddress)
      if (iscontract) {
        const erc20Contract = new ethers.Contract(paymentToken, erc20ABI.abi, provider)
        let allowance = await erc20Contract.allowance(walletAddress, paymasterAddress)//paymaster address
        allowance = ethers.utils.formatUnits(allowance, 6);

        if (Number(allowance) < Number(20)) {//amt
          //if approved, pop up modal, and ask for approval
          return { success: false, mustApprove: true, paymasterAddress, tokenAddr: paymentToken }

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
      const receipt = await wallet.stake(auth, {amount}, {gasLimit: 300000});
    //Tells frontend stake was success
    console.log("txId: ",receipt, receipt.txid)
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