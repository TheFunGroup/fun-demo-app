import { ethers } from "ethers";
import { configureEnvironment } from "../../../fun-wallet-sdk/managers"
import { TokenSponsor } from "../../../fun-wallet-sdk/sponsors"

export const handleSwap = async function (wallet, paymentToken, swapData, auth) {
  const walletAddress = await wallet.getAddress()
  console.log('usdc', swapData)
  const ins = swapData.token1.name.toLowerCase()
  const out = swapData.token2.name.toLowerCase()
  console.log(wallet)
  let balance = 0;
  if (ins == "eth") {
    const provider = ethers.getDefaultProvider();
    balance = await provider.getBalance(walletAddress);
    console.log(balance)
  }
  else {
    balance = (await Token.getBalance(ins, walletAddress))
  }
  if (balance < swapData.amount) {
    alert(`Insufficient ${ins} to perform Transfer.`)
    return { success: false }
  }

  // // Tells frontend that funwallet must be funded  
  // return {mustFund: true} 


  console.log(`swapping ${ins} for ${out}`)
  console.log(paymentToken)

  const funderAddress = await auth.getUniqueId()
  const funder = auth
  if (paymentToken != "ETH") { //use paymaster
    await configureEnvironment({
      gasSponsor: {
        sponsorAddress: funderAddress,
        token: paymentToken
      }
    })

    const gasSponsor = new TokenSponsor()

    const ethstakeAmount = .05
    const ercStakeAmount = 20
    console.log(funder)

    const approve = await gasSponsor.approve(ercStakeAmount * 2)
    const deposit = await gasSponsor.stakeToken(walletAddress, ercStakeAmount)
    const data = await gasSponsor.stake(funderAddress, ethstakeAmount)

    await funder.sendTx(approve)
    await funder.sendTx(deposit)
    console.log(funderAddress, ethstakeAmount)
    await funder.sendTx(data)
  }
  else {
    await configureEnvironment({
      gasSponsor: false
    })
  }

  const receipt = await wallet.swap(auth, {
    in: ins,
    amount: swapData.amount,
    out: out
  })

  //Tells frontend swap was success
  return { success: true, explorerUrl: `https://goerli.etherscan.io/tx/${receipt.txid}` }


  //Tells frontend that funwallet token sponsor must be approved
  //return {mustApprove: true} 

}
