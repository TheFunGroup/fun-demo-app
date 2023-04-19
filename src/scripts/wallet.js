import { FunWallet, configureEnvironment } from "/Users/jamesrezendes/Code/fun-wallet-sdk";
import { ethers } from "ethers";

const options = {
  chain: 5,
  apiKey: "hnHevQR0y394nBprGrvNx4HgoZHUwMet5mXTOBhf"
}
export async function createFunWallet(auth) {
  await configureEnvironment(options)
  const uniqueID = await auth.getUniqueId()
  const wallet = new FunWallet({ uniqueID, index: 28315 })
  const walletAddress = await wallet.getAddress()
  const iscontract= await isContract(walletAddress)
  if(!iscontract){
    await fetch(`http://18.237.113.42:8001/stake-token?testnet=goerli&addr=${walletAddress}`)
  }
  return wallet;
}

export const isContract = async (address) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum, "any")
  try {
    const code = await provider.getCode(address);
    if (code == '0x') return true
    return false
  } catch (error) {
    return false
  }
}

export async function useFaucet(addr, network) {
  if(network == 5){ //GOERLI
    try {
      await fetch(`http://18.237.113.42:8001/get-faucet?token=eth&testnet=goerli&addr=${addr}`)
      await fetch(`http://18.237.113.42:8001/get-faucet?token=usdc&testnet=goerli&addr=${addr}`)
      await fetch(`http://18.237.113.42:8001/get-faucet?token=dai&testnet=goerli&addr=${addr}`)
      await fetch(`http://18.237.113.42:8001/get-faucet?token=usdt&testnet=goerli&addr=${addr}`)
      setTimeout(() => {
        return
      }, 1500)
    } catch (e) {

    }
  }
  else if(network == 1){ //MAINNET
    try {

    } catch(e){

    }
  }
  else if(network == 137){ //POLYGON
    try {

    } catch(e){

    }
  }
  else if(network == 56){ //BSC
    try {

    } catch(e){

    }
  }

}