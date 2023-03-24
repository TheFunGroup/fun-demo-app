import { ethers } from "ethers";
import { FunWallet, FunWalletConfig } from "@fun-wallet/sdk";

// const API_KEY = "<FUN API KEY>"
const API_KEY = "hnHevQR0y394nBprGrvNx4HgoZHUwMet5mXTOBhf"

export async function createFunWallet(eoa, chainID){
  const config = new FunWalletConfig(eoa, chainID)
  const wallet = new FunWallet(config, API_KEY)
  await wallet.init()
  console.log(wallet)
  return wallet;
}