import { ethers } from "ethers";
import { configureEnvironment } from "fun-wallet/managers";
import { TokenSponsor } from "fun-wallet/sponsors";
import { Token } from "fun-wallet/data";
import { tokens } from "../utils/tokens"
import erc20ABI from "../utils/funTokenAbi.json";
import { isContract } from "./wallet";
import nftABI from "../utils/nftABI.json"
import { apiKey } from "../utils/constants";
export const handleMintNFT = async function (wallet, paymentToken, nft, auth) {
  const nftNumber = nft.nft;
  try {
    const walletAddress = await wallet.getAddress()
    let paymentaddr = ""
    for (let i of tokens["5"]) {
      if (i.name == paymentToken && paymentToken != "ETH") {
        paymentaddr = i.addr
      }
    }
    //token paymaster
    if(paymentToken != "ETH" && paymentToken != "gasless"){
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
      const provider = new ethers.providers.JsonRpcProvider("https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161");
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
    else{ //base
      await configureEnvironment({
        chain: 5,
        apiKey,
        gasSponsor: false
      })
    }
    const nftContract = new ethers.Contract("0x2749B15E4d39266A2C4dA9c835E9C9e384267C5A", nftABI)
    const tx = await nftContract.populateTransaction.safeMint(walletAddress, `nft${nftNumber}.png`)
    let receipt = await wallet.execRawTx(auth, tx)
    console.log("txId: ", receipt.txid)
    const explorerUrl = receipt.txid ? `https://goerli.etherscan.io/tx/${receipt.txid}` : `https://goerli.etherscan.io/address/${walletAddress}#internaltx`
    return { success: true, explorerUrl }
  } catch (e) {
    console.log(e)
    return { success: false, error: e.toString() }
  }
}

