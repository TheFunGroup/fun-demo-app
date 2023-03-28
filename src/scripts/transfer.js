import { ethers } from "ethers";
import { configureEnvironment } from "../../../fun-wallet-sdk/managers"
import { TokenSponsor } from "../../../fun-wallet-sdk/sponsors"

export const handleTransfer = async function (wallet, paymentToken, transferData, auth) {

  try {
    if (!transferData.to) {
      alert("No Receiver Address Specified")
      return { success: false }
    }
    const walletAddress = await wallet.getAddress()
    console.log(wallet)
    console.log(transferData)
    let balance = 0;
    if(transferData.token.name=="ETH"){
      const provider = new ethers.providers.JsonRpcProvider("https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161");
      balance = await provider.getBalance(walletAddress);
      balance = ethers.utils.formatEther(balance);
  
    }
    else{
      balance = (await Token.getBalance(transferData.token.name, walletAddress))
    }
    if(balance<transferData.amount){
      alert(`Insufficient ${transferData.token.name} to perform Transfer.`)
      return {success:false}
      // return { success: false }
    }
  
    const funderAddress =await auth.getUniqueId()
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
      console.log('jkajsdfkjsad')
      await funder.sendTx(deposit)
      console.log('jkajsdsdfsdasdfffkjsad')
      console.log(data)
      console.log(funderAddress, ethstakeAmount)
      await funder.sendTx(data)
      console.log('sdasdf')
  
    }
    else {
      await configureEnvironment({
        gasSponsor: false
      })
    }
  
    if (transferData.token.name != "ETH") {
      console.log("Transfering ERC")
      const receipt = await wallet.transfer(auth, { to: transferData.to, amount: transferData.amount, token: transferData.token.name })
      console.log(receipt)
      return { success: true, explorerUrl: `https://goerli.etherscan.io/tx/${receipt.txid}` }
    }
    else {
      const receipt = await wallet.transfer(auth, { to: transferData.to, amount: transferData.amount })
      console.log(receipt)
      return { success: true, explorerUrl: `https://goerli.etherscan.io/tx/${receipt.txid}` }
    }
  } catch(e){
    return {success: false, error: e}
  }
}

