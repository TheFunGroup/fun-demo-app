import { FunWallet, configureEnvironment } from "fun-wallet";
import { getStoredUniqueId } from "fun-wallet/utils";
import { ethers } from "ethers";
import { apiKey } from "../utils/constants";
import {handleFundWallet} from '../scripts/fund'
const options = {
  chain: 5,
  apiKey
}

const WALLET_INDEX = 34788

export async function createFunWallet(auth) {
  await configureEnvironment(options)
  const uniqueId = await auth.getUniqueId();
  const wallet = new FunWallet({ uniqueId, index: WALLET_INDEX })
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

export const isAuthIdUsed = async (authId) => {
  try {
    await configureEnvironment(options)
    const uniqueId = await getStoredUniqueId(authId)
    if (uniqueId) {
      return true
    } else {
      return false
    }
  } catch (error) {
    console.log("isAuthIdUsed error: ", error)
    return false
  }
}

export async function useFaucet(addr, network) {
  if (network == 5) { //GOERLI
    try {
      await handleFundWallet(addr)
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

export async function getAddress(uniqueId, chainId, index = WALLET_INDEX, apiKey = options.apiKey) {
  try {
    const addr = await FunWallet.getAddress(uniqueId, index, chainId, apiKey)
    return addr;
  } catch (e) {
    return false;
  }
}