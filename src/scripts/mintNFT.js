import { ethers } from "ethers";
import { configureEnvironment } from "/Users/jamesrezendes/Code/fun-wallet-sdk/managers";
import { TokenSponsor } from "/Users/jamesrezendes/Code/fun-wallet-sdk/sponsors";
import { Token } from "/Users/jamesrezendes/Code/fun-wallet-sdk/data";
import { tokens } from "../utils/tokens"
import erc20ABI from "../utils/funTokenAbi.json";
import { isContract } from "./wallet";

export const handleMintNFT = async function (wallet, paymentToken, nft, auth) {
  try {
    return { success: true, explorerUrl: `https://goerli.etherscan.io/tx/42069`, nft }
  } catch (e) {
    console.log(e)
    return { success: false, error: e }
  }
}

