import { ethers } from "ethers";
import Quoter from "@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json"

export const getSwapAmount = async function (token1, amt, token2) {
  try {
    const swapInfo = await (await fetch(`https://min-api.cryptocompare.com/data/price?fsym=${token1}&tsyms=${token2}`)).json()
    console.log(swapInfo)
    const amount = swapInfo[token2] * amt;
    return amount
  } catch(e){
    console.log(e)
  }
}

export const toUSD = async function(token, amt){
  try {
    const swapInfo = await (await fetch(`https://min-api.cryptocompare.com/data/price?fsym=${token}&tsyms=usd`)).json()
    const amount = swapInfo["USD"] * amt;
    return amount.toFixed(2)
  } catch(e){
    console.log(e)
  }
}