export const getSwapAmount = async function (token1, amt, token2) {
  try {
    const swapInfo = await (await fetch(`https://min-api.cryptocompare.com/data/price?fsym=${token1.name}&tsyms=${token2.name}`)).json()
    console.log(swapInfo)
    const amount = swapInfo[token2.name] * amt;
    return amount.toFixed(2)
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