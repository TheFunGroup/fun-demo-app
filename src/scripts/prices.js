import { ethers } from "ethers";
import { FeeAmount } from '@uniswap/v3-sdk'
import Quoter from "@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json"

export const getSwapInfo = async function (token1, amount, token2, chainId, eoa) {
  try {
    const quoterContract = new ethers.Contract("0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6", Quoter.abi, eoa)
    let amountOut = await quoterContract.callStatic.quoteExactInputSingle(
      token1.addr,
      token2.addr,
      FeeAmount.MEDIUM,
      ethers.utils.parseUnits(amount.toString(), token1.decimal),
      0
    )
    const preDecimal=amountOut.toString()
    const amt=`${preDecimal.substring(0,preDecimal.length-token2.decimal)}.${preDecimal.substring(preDecimal.length-token2.decimal, preDecimal.length)}`
    return amt
  } catch(e){
    console.log(e)
  }
}