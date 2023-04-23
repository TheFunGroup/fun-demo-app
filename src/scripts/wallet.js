import { FunWallet, configureEnvironment } from "/Users/chaz/workspace/fun-wallet/fun-wallet-sdk";
import { ethers } from "ethers";

const options = {
  chain: 5,
  apiKey: "hnHevQR0y394nBprGrvNx4HgoZHUwMet5mXTOBhf"
}
export async function createFunWallet(auth) {
  await configureEnvironment(options)
  const uniqueId = await auth.getUniqueId();
  const wallet = new FunWallet({ uniqueId, index: 28315 })
  const addr = await wallet.getAddress();
  wallet.address = addr;
  return wallet;
}

export const isContract = async (address, provider) => {
  if (!provider) provider = new ethers.providers.JsonRpcProvider("https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161");
  try {
    const code = await provider.getCode(address);
    if (code == '0x') return false
    return true
  } catch (error) {
    return false
  }
}

export async function useFaucet(addr, network) {
  if (network == 5) { //GOERLI
    try {
      await fetch(`http://18.237.113.42:8001/stake-token?testnet=goerli&addr=${addr}`)
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
  else if (network == 1) { //MAINNET
    try {

    } catch (e) {

    }
  }
  else if (network == 137) { //POLYGON
    try {

    } catch (e) {

    }
  }
  else if (network == 56) { //BSC
    try {

    } catch (e) {

    }
  }

}

export async function getAddress(uniqueId, index, chainId) {
  try {
    const addr = await FunWallet.getAddress(uniqueId, index, chainId)
    return addr;
  } catch (e) {
    return false;
  }
}