import { ethers } from "ethers";
import { configureEnvironment } from "fun-wallet/managers";
import { TokenSponsor } from "fun-wallet/sponsors";
import { Token } from "fun-wallet/data";
import { tokens } from "../utils/tokens"
import erc20ABI from "../utils/funTokenAbi.json";
import { isContract } from "./wallet";
import { FunWallet } from 'fun-wallet/'
import { Eoa } from 'fun-wallet/auth'
import nftABI from "../utils/nftABI.json"
export const handleMintNFT = async function (wallet, paymentToken, nft, auth) {
  try {

    const nft = new ethers.Contract("0x18e6a90659114a53ef143045e8b36d790ee3cd6c", nftABI)
    const address = await wallet.getAddress()
    const tx = await nft.populateTransaction.safeMint(address)
    let rec = await wallet.execRawTx(auth, tx)

    return { success: true, explorerUrl: `https://goerli.etherscan.io/tx/${rec.txid}`, nft }
  } catch (e) {
    console.log(e)
    return { success: false, error: e }
  }
}

