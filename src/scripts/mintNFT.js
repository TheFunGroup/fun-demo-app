import { ethers } from "ethers";
import { configureEnvironment } from "/Users/aaronchew/CodeProjects/fun-wallet-sdk/managers";
import { TokenSponsor } from "/Users/aaronchew/CodeProjects/fun-wallet-sdk/sponsors";
import { Token } from "/Users/aaronchew/CodeProjects/fun-wallet-sdk/data";
import { tokens } from "../utils/tokens"
import erc20ABI from "../utils/funTokenAbi.json";
import { isContract } from "./wallet";
import { FunWallet } from '/Users/aaronchew/CodeProjects/fun-wallet-sdk/'
import { Eoa } from '/Users/aaronchew/CodeProjects/fun-wallet-sdk/auth'
import nftABI from "../utils/nftABI.json"
export const handleMintNFT = async function (wallet, paymentToken, nft, auth) {
  try {
    // const privateKey = "0x6270ba97d41630c84de28dd8707b0d1c3a9cd465f7a2dba7d21b69e7a1981064"
    // const rpcUrl = "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
    // const provider = new ethers.providers.JsonRpcProvider(rpcUrl)
    // const signer = new ethers.Wallet(privateKey, provider)
    // const auth = new Eoa({ signer })
    // // Get FunWallet associated with EOA
    // const uniqueId = await auth.getUniqueId()
    // const funWallet = new FunWallet({ uniqueId, index: 10232 })

    const signer = await auth.getSigner()
    const nft = new ethers.Contract("0x18e6a90659114a53ef143045e8b36d790ee3cd6c", nftABI, signer)
    const address = await wallet.getAddress()
    const tx = await nft.populateTransaction.safeMint(address)
    const rec = await wallet.execRawTx(auth, tx)

    return { success: true, explorerUrl: `https://goerli.etherscan.io/tx/${rec.txid}`, nft }
  } catch (e) {
    console.log(e)
    return { success: false, error: e }
  }
}

