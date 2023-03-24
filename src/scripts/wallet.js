import { ethers } from "ethers";
import { FunWallet, FunWalletConfig } from "@fun-wallet/sdk/wallet/index";
// import { Eoa } from "@fun-wallet/sdk/auth/EoaAuth";
import { Eoa } from "../../../wallet-sdk-v1/auth/EoaAuth"

// const API_KEY = "<FUN API KEY>"
const API_KEY = "hnHevQR0y394nBprGrvNx4HgoZHUwMet5mXTOBhf"

export async function createFunWallet(eoa, chainID){
  // const config = new FunWalletConfig(eoa, chainID)
  const salt = await eoa.getUniqueId()
  const wallet = new FunWallet({ salt, index: 1 })

  console.log(wallet)
  return wallet;
}