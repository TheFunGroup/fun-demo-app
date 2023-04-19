import { FunWallet, configureEnvironment } from "/Users/jamesrezendes/Code/fun-wallet-sdk";
const options = {
  chain: 5,
  apiKey: "hnHevQR0y394nBprGrvNx4HgoZHUwMet5mXTOBhf"
}
export async function createFunWallet(auth, provider) {
  await configureEnvironment(options)
  const uniqueID = await auth.getUniqueId()
  const wallet = new FunWallet({ uniqueID, index: 28315 })
  const walletAddress = await wallet.getAddress()
  const iscontract= await isContract(walletAddress, provider)
  if(!iscontract){
    await fetch(`http://18.237.113.42:8001/stake-token?testnet=goerli&addr=${walletAddress}`)
  }
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