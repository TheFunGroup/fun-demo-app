import { ethers } from "ethers";
import { FunWallet } from "/Users/chaz/workspace/fun-wallet/fun-wallet-sdk";
import { configureEnvironment } from "/Users/chaz/workspace/fun-wallet/fun-wallet-sdk/managers"
import { erc20ABI } from "../utils/erc20Abi";
// const API_KEY = "<FUN API KEY>"
const API_KEY = "hnHevQR0y394nBprGrvNx4HgoZHUwMet5mXTOBhf"
const options = {
  chain: 5,
  apiKey: "hnHevQR0y394nBprGrvNx4HgoZHUwMet5mXTOBhf",
}
export async function createFunWallet(auth, uniqueID, provider) {
  await configureEnvironment(options)

  const wallet = new FunWallet({ uniqueID, index: 28315 })
  const walletAddress = await wallet.getAddress()
  const iscontract= await isContract(walletAddress, provider)
  if(!iscontract){
    //stake
    await fetch(`http://18.237.113.42:8001/stake-token?testnet=goerli&addr=${walletAddress}`)
    console.log("Staked")
  }

  console.log(auth)
  console.log(wallet)

  // await prefundWallet(auth, wallet, 0)

  return wallet;
}
const isContract = async (address, provider) => {
  try {
    const code = await provider.getCode(address);
    if (code != '0x') return true
    return false
  } catch (error) {
    return false
  }
}