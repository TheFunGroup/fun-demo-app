import { ethers } from "ethers";
import { configureEnvironment } from "/Users/aaronchew/CodeProjects/fun-wallet-sdk/managers";
import { TokenSponsor } from "/Users/aaronchew/CodeProjects/fun-wallet-sdk/sponsors";
import { Token } from "/Users/aaronchew/CodeProjects/fun-wallet-sdk/data";
import { tokens } from "../utils/tokens"
import erc20ABI from "../utils/funTokenAbi.json";
import { isContract } from "./wallet";
import nftABI  from "../utils/nftABI.json"
export const handleMintNFT = async function (wallet, paymentToken, nft, auth) {
  try {
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

