import { ethers } from "ethers";
import { FunWallet, FunWalletConfig } from "@fun-wallet/sdk/wallet/index";
// import { Eoa } from "@fun-wallet/sdk/auth/EoaAuth";
import { Eoa } from "../../../wallet-sdk-v1/auth/EoaAuth"
import { prefundWallet } from "../../../wallet-sdk-v1/utils";
import { configureEnvironment } from "@fun-wallet/sdk/managers"

// const API_KEY = "<FUN API KEY>"
const API_KEY = "hnHevQR0y394nBprGrvNx4HgoZHUwMet5mXTOBhf"
const options = {
  chain: 5,
  apiKey: "hnHevQR0y394nBprGrvNx4HgoZHUwMet5mXTOBhf",
}
export async function createFunWallet(eoa, chainID){
  await configureEnvironment(options)

  // const config = new FunWalletConfig(eoa, chainID)
  const salt = await eoa.getUniqueId()
  const wallet = new FunWallet({ salt, index: 0 })

  console.log(eoa)
  console.log(wallet)

  // await prefundWallet(eoa, wallet, 0)

  return wallet;
}