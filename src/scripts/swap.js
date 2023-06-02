import { ethers } from "ethers"
import { checkWalletPaymasterConfig, checkIfWalletIsPrefunded } from "./wallet"
import { Token, TokenSponsor, configureEnvironment } from "../../fun-wallet/dist"
// import { Token } from "../../fun-wallet/dist/data"
import { apiKey } from "../utils/constants"
import erc20ABI from "../utils/funTokenAbi.json"
import { tokens } from "../utils/tokens"

const CHAIN_ID = 5

export const handleSwap = async function (wallet, paymentToken, swapData, auth) {
    try {
        const walletAddress = await wallet.getAddress()
        let inAddr = ""
        let outAddr = ""
        let paymentaddr = ""
        for (let i of tokens["5"]) {
            if (i.name == swapData.token1.name) {
                inAddr = i.addr
            }
            if (i.name == swapData.token2.name) {
                outAddr = i.addr
            }
            if (i.name == paymentToken && paymentToken != "ETH") {
                paymentaddr = i.addr
            }
        }

        const ins = swapData.token1.name.toLowerCase()
        const out = swapData.token2.name.toLowerCase()
        const provider = new ethers.providers.JsonRpcProvider("https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161")
        let balance = 0
        if (ins == "eth") {
            balance = await provider.getBalance(walletAddress)
            balance = ethers.utils.formatEther(balance)
        } else {
            console.log(Token)

            try {
                // balance = await Token.getBalance(inAddr, walletAddress)
            } catch (err) {
                console.log(err)
            }
        }

        if (balance < swapData.amount) {
            return { success: false, mustFund: true }
        }
        // // Tells frontend that funwallet must be funded
        let envOptions = await checkWalletPaymasterConfig(wallet, paymentToken, CHAIN_ID)
        if (!envOptions.success) return envOptions

        const estimatedGasCalc = await wallet.swap(
            auth,
            {
                in: ins == "eth" ? "eth" : inAddr,
                amount: swapData.amount,
                out: out == "eth" ? "eth" : outAddr
            },
            envOptions.envOptions,
            true
        )
        if (!estimatedGasCalc || estimatedGasCalc.isZero()) return { success: false, error: "Estimated gas is 0" }
        const native = envOptions.envOptions.gasSponsor === false

        const prefundStatus = await checkIfWalletIsPrefunded(wallet, estimatedGasCalc, CHAIN_ID, native)
        if (!prefundStatus.success) return prefundStatus

        console.log(auth, {
            in: ins == "eth" ? "eth" : inAddr,
            amount: swapData.amount,
            out: out == "eth" ? "eth" : outAddr
        })
        const receipt = await wallet.swap(auth, {
            in: ins == "eth" ? "eth" : inAddr,
            amount: swapData.amount,
            out: out == "eth" ? "eth" : outAddr
        })

        //Tells frontend swap was success
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
