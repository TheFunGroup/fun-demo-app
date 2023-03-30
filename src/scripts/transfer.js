import { ethers } from "ethers";
import { configureEnvironment } from "../../../fun-wallet-sdk/managers"
import { TokenSponsor } from "../../../fun-wallet-sdk/sponsors"
import {Token } from "../../../fun-wallet-sdk/data/"
import { tokens } from "../utils/tokens"

export const handleTransfer = async function (wallet, paymentToken, transferData, auth) {

  try {
    if (!transferData.to) {
      alert("No Receiver Address Specified")
      return { success: false }
    }
    const walletAddress = await wallet.getAddress()
    console.log(wallet)
    console.log(transferData)
    let tokenaddr="eth"
    let paymentaddr=""
    for (let i of tokens["5"]) {
      if (i.name == transferData.token.name && transferData.token.name!="ETH") {
        tokenaddr=i.addr
      }
      if(i.name==paymentToken && paymentToken!="ETH"){
        paymentaddr=i.addr
      }
    }
    console.log(`paying with ${paymentaddr}`)
  

    let balance = 0;
    if (transferData.token.name == "ETH") {
      const provider = new ethers.providers.JsonRpcProvider("https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161");
      balance = await provider.getBalance(walletAddress);
      balance = ethers.utils.formatEther(balance);

    }
    else {
      balance = (await Token.getBalance(tokenaddr, walletAddress))
      console.log(balance)
    }
    if (Number(balance) < Number(transferData.amount)) {
      console.log(transferData.amount)
      console.log(balance)
      return { success: false, mustFund: true }
      // return { success: false }
    }

    const funderAddress = await auth.getUniqueId()
    const funder = auth
    if (paymentToken != "ETH") { //use paymaster
      await configureEnvironment({
        chain: 5,
        apiKey: "hnHevQR0y394nBprGrvNx4HgoZHUwMet5mXTOBhf",
        gasSponsor: {
          sponsorAddress: funderAddress,
          token: paymentaddr
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
      console.log(data)
      console.log(funderAddress, ethstakeAmount)
      await funder.sendTx(data)

    }
    else {
      await configureEnvironment({
        chain: 5,
        apiKey: "hnHevQR0y394nBprGrvNx4HgoZHUwMet5mXTOBhf",
        gasSponsor: false
      })
    }

    if (transferData.token.name != "ETH") {
      console.log("Transfering ERC")
      const receipt = await wallet.transfer(auth, { to: transferData.to, amount: transferData.amount, token: tokenaddr })
      console.log(receipt)
      return { success: true, explorerUrl: `https://goerli.etherscan.io/tx/${receipt.txid}` }
    }
    else {
      const receipt = await wallet.transfer(auth, { to: transferData.to, amount: transferData.amount })
      console.log(receipt)
      return { success: true, explorerUrl: `https://goerli.etherscan.io/tx/${receipt.txid}` }
    }
  } catch (e) {
    console.log(e)
    return { success: false, error: e }
  }
}

