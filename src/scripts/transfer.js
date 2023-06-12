import { ethers } from "ethers"
import { checkWalletPaymasterConfig, checkIfWalletIsPrefunded } from "./wallet"
import { Token, TokenSponsor, configureEnvironment } from "fun-wallet"

import { tokens } from "../utils/tokens"

const CHAIN_ID = 5
export const handleTransfer = async function (wallet, paymentToken, transferData, auth) {
    console.log("handleTransfer: ", paymentToken, transferData)
    try {
        if (!transferData.to) {
            return { success: false, error: "No Receiver Address Specified" }
        }
        if (!transferData.to.startsWith("0x") || transferData.to.length != 42) {
            return { success: false, error: "Invalid Receiver Address" }
        }
        const walletAddress = await wallet.getAddress()
        let tokenaddr = "eth"
        let paymentaddr = ""

        for (let i of tokens["5"]) {
            if (i.name == transferData.token.name && transferData.token.name != "ETH") {
                tokenaddr = i.addr
            }
            if (i.name == paymentToken && paymentToken != "ETH") {
                paymentaddr = i.addr
            }
        }

        let balance = 0
        const provider = new ethers.providers.JsonRpcProvider("https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161")
        if (transferData.token.name == "ETH") {
            balance = await provider.getBalance(walletAddress)
            balance = ethers.utils.formatEther(balance)
        } else {
            balance = await Token.getBalance(tokenaddr, walletAddress)
        }
        if (Number(balance) < Number(transferData.amount) || Number(balance) < Number(0.1)) {
            return { success: false, mustFund: true }
        }
        let envOptions = await checkWalletPaymasterConfig(wallet, paymentToken, CHAIN_ID)
        if (!envOptions.success) return envOptions
        // envOptions.envOptions.sendTxLater = true
        await configureEnvironment(envOptions.envOptions)
        const estimatedGasCalc = await wallet.transfer(
            auth,
            { to: transferData.to, amount: transferData.amount, token: tokenaddr },
            envOptions.envOptions,
            true
        )
        if (!estimatedGasCalc || estimatedGasCalc.isZero()) return { success: false, error: "Estimated gas is 0" }

        const native = envOptions.envOptions.gasSponsor === false
        const prefundStatus = await checkIfWalletIsPrefunded(wallet, estimatedGasCalc, CHAIN_ID, native)
        if (!prefundStatus.success) return prefundStatus

        if (transferData.token.name != "ETH") {
            const receipt = await wallet.transfer(auth, { to: transferData.to, amount: transferData.amount, token: tokenaddr })
            console.log("txId: ", receipt.txid)
            const explorerUrl = receipt.txid
                ? `https://goerli.etherscan.io/tx/${receipt.txid}`
                : `https://goerli.etherscan.io/address/${walletAddress}#internaltx`
            return { success: true, explorerUrl }
        } else {
            const receipt = await wallet.transfer(auth, { to: transferData.to, amount: transferData.amount })
            console.log("txId: ", receipt.txid)
            const explorerUrl = receipt.txid
                ? `https://goerli.etherscan.io/tx/${receipt.txid}`
                : `https://goerli.etherscan.io/address/${walletAddress}#internaltx`
            return { success: true, explorerUrl }
        }
    } catch (e) {
        console.log(e)
        return { success: false, error: e.toString() }
    }
}
