import { ethers } from "ethers"
import { checkWalletPaymasterConfig, checkIfWalletIsPrefunded } from "./wallet"
import nftABI from "../utils/nftABI.json"
import { tokens } from "../utils/tokens"

const CHAIN_ID = 5

export const handleMintNFT = async function (wallet, paymentToken, nft, auth) {
    const nftNumber = nft.nft
    try {
        const walletAddress = await wallet.getAddress()
        let paymentaddr = ""
        for (let i of tokens["5"]) {
            if (i.name == paymentToken && paymentToken != "ETH") {
                paymentaddr = i.addr
            }
        }
        // set environment options
        let envOptions = await checkWalletPaymasterConfig(wallet, paymentToken, CHAIN_ID)
        if (!envOptions.success) return envOptions

        // initialize NFT contract
        const nftContract = new ethers.Contract("0x2749B15E4d39266A2C4dA9c835E9C9e384267C5A", nftABI)
        const tx = await nftContract.populateTransaction.safeMint(walletAddress, `nft${nftNumber}.png`)
        // estimate gas and make sure the wallet does not need to be prefunded
        const estimatedGasCalc = await wallet.execRawTx(auth, tx, envOptions.envOptions, true)
        if (!estimatedGasCalc || estimatedGasCalc.isZero()) return { success: false, error: "Estimated gas is 0" }
        const native = envOptions.envOptions.gasSponsor === false
        const prefundStatus = await checkIfWalletIsPrefunded(wallet, estimatedGasCalc, CHAIN_ID, native)
        if (!prefundStatus.success) return prefundStatus
        // execute smart contract transactions.
        let receipt = await wallet.execRawTx(auth, tx)
        console.log("txId: ", receipt.txid)
        const explorerUrl = receipt.txid
            ? `https://goerli.etherscan.io/tx/${receipt.txid}`
            : `https://goerli.etherscan.io/address/${walletAddress}#internaltx`
        return { success: true, explorerUrl }
    } catch (e) {
        console.log(e)
        return { success: false, error: e.toString() }
    }
}
