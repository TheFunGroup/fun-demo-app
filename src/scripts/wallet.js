import { ethers } from "ethers";
import { FunWallet } from "@fun-wallet/sdk";
import { configureEnvironment } from "@fun-wallet/sdk/managers"
import { erc20ABI } from "../utils/erc20Abi";
// const API_KEY = "<FUN API KEY>"
const API_KEY = "hnHevQR0y394nBprGrvNx4HgoZHUwMet5mXTOBhf"
const options = {
  chain: 5,
  apiKey: "hnHevQR0y394nBprGrvNx4HgoZHUwMet5mXTOBhf",
}
export async function createFunWallet(auth, chainID, provider) {
  await configureEnvironment(options)

  // const config = new FunWalletConfig(eoa, chainID)
  const salt = await auth.getUniqueId()
  const wallet = new FunWallet({ salt, index: 28314 })
  const walletAddress = await wallet.getAddress()
  const iscontract=await isContract(walletAddress, provider)
  console.log(isContract)
  if(!iscontract){
    //stake
    const STAKEURL="https://vyhjm494l3.execute-api.us-west-2.amazonaws.com/prod/demo-faucet/stake-token"
    // await fetch(`http://18.237.113.42:8001/stake-token?testnet=goerli&addr=${walletAddress}`)
    await fetch(`${STAKEURL}?testnet=goerli&addr=${walletAddress}`)
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
    if (code != '0x') return true;
  } catch (error) {
    return false
  }
}