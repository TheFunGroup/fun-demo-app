import { ethers } from "ethers"
import { isContract } from "./wallet"
import { configureEnvironment } from "../../fun-wallet/src/config"
import { TokenSponsor } from "../../fun-wallet/src/sponsors"
import { apiKey } from "../utils/constants"
import erc20ABI from "../utils/funTokenAbi.json"
// requires
// Wallet funWallet
// paymentToken String (ETH, gassless, or address of ERC20 token)
// amount string ETH amount to stake
// auth Object or EOA signer specifically.
// estimate gas boolean
export const handleStakeEth = async function (wallet, paymentToken, amount, auth, estimateGas = false) {
    try {
        const provider = new ethers.providers.JsonRpcProvider("https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161")
        const walletAddress = await wallet.getAddress()
        // validate the params
        if (parseFloat(amount) <= 0) return { success: false, error: "Staking amount must be greater than 0" }

        // Tells frontend that funwallet must be funded
        if (paymentToken != "ETH" && paymentToken != "gasless") {
            //use paymaster
            await configureEnvironment({
                chain: 5,
                apiKey,
                gasSponsor: {
                    sponsorAddress: "0x07Ac5A221e5b3263ad0E04aBa6076B795A91aef9",
                    token: paymentToken
                }
            })
            const gasSponsor = new TokenSponsor()
            const paymasterAddress = await gasSponsor.getPaymasterAddress()
            const iscontract = await isContract(walletAddress)
            if (iscontract) {
                const erc20Contract = new ethers.Contract(paymentToken, erc20ABI.abi, provider)
                let allowance = await erc20Contract.allowance(walletAddress, paymasterAddress) //paymaster address
                allowance = ethers.utils.formatUnits(allowance, 6)
                if (Number(allowance) < Number(20)) {
                    //amt
                    //if approved, pop up modal, and ask for approval
                    return { success: false, mustApprove: true, paymasterAddress, tokenAddr: paymentToken }
                }
            } else
                return {
                    success: false,
                    error: "Its a known bug that first transaction of a fun wallet would fail if you are covering gas using ERC20 tokens. Please try to pay gas using gasless paymaster or ETH for this transaction and try token paymaster later."
                }
        } else if (paymentToken == "gasless") {
            await configureEnvironment({
                chain: 5,
                apiKey,
                gasSponsor: {
                    sponsorAddress: "0x07Ac5A221e5b3263ad0E04aBa6076B795A91aef9"
                }
            })
        } else {
            await configureEnvironment({
                chain: 5,
                apiKey,
                gasSponsor: false
            })
        }
        // try {
        const receipt = await wallet.stake(auth, { amount }, { gasLimit: 300000 }, estimateGas)
        if (estimateGas) return { success: true, receipt }
        //Tells frontend stake was success
        console.log("txId: ", receipt, receipt.txid)
        const explorerUrl = receipt.txid
            ? `https://goerli.etherscan.io/tx/${receipt.txid}`
            : `https://goerli.etherscan.io/address/${walletAddress}#internaltx`
        return { success: true, explorerUrl }
        // } catch (err) {
        //     console.log(err)
        //     return { success: false, error: err.toString() }
        // }
        // }
    } catch (e) {
        console.log(e)
        return { success: false, error: e.toString() }
    }
}

export const getStETHBalanceGoerli = async (address, provider) => {
    const chainId = await provider.getNetwork()?.chainId
    if (!chainId || chainId !== 5) throw new Error("Invalid chainId")
    let stETHAddress = "0x1643e812ae58766192cf7d2cf9567df2c37e9b7f" //goerli only
    const stETHContract = new ethers.Contract(stETHAddress, erc20ABI, provider)
    const balance = await stETHContract.balanceOf(address)
    return ethers.utils.formatUnits(balance, 18)
}

export const handleUnstakeEth = async function (wallet, paymentToken, amount, auth, estimateGas = false) {
    if (wallet == null) return { success: false, error: "Wallet not initialized" }
    if (auth == null) return { success: false, error: "Auth not initialized" }
    try {
        const signer = await auth.getSigner()
        const walletAddress = await wallet.getAddress()
        const stEthBalance = await getStETHBalanceGoerli(walletAddress, signer)
        if (parseFloat(amount) > parseFloat(stEthBalance) && !estimateGas) return { success: false, error: "Not enough stETH balance" }

        // Tells frontend that funwallet must be funded
        if (paymentToken !== "ETH" && paymentToken !== "gasless") {
            //use paymaster
            await configureEnvironment({
                chain: 5,
                apiKey,
                gasSponsor: {
                    sponsorAddress: "0x07Ac5A221e5b3263ad0E04aBa6076B795A91aef9",
                    token: paymentToken
                }
            })
            const gasSponsor = new TokenSponsor()
            const paymasterAddress = await gasSponsor.getPaymasterAddress()
            const iscontract = await isContract(walletAddress)
            if (iscontract) {
                const erc20Contract = new ethers.Contract(paymentToken, erc20ABI.abi, signer)
                let allowance = await erc20Contract.allowance(walletAddress, paymasterAddress) //paymaster address
                allowance = ethers.utils.formatUnits(allowance, 6)
                if (Number(allowance) < Number(20)) {
                    //amt
                    //if approved, pop up modal, and ask for approval
                    return { success: false, mustApprove: true, paymasterAddress, tokenAddr: paymentToken }
                }
            } else
                return {
                    success: false,
                    error: "Its a known bug that first transaction of a fun wallet would fail if you are covering gas using ERC20 tokens. Please try to pay gas using gasless paymaster or ETH for this transaction and try token paymaster later."
                }
        } else if (paymentToken === "gasless") {
            await configureEnvironment({
                chain: 5,
                apiKey,
                gasSponsor: {
                    sponsorAddress: "0x07Ac5A221e5b3263ad0E04aBa6076B795A91aef9"
                }
            })
        } else {
            await configureEnvironment({
                chain: 5,
                apiKey,
                gasSponsor: false
            })
        }

        // handle unstake start

        // check the wallet balance of stETH and make sure its less than amount using ethers
    } catch (e) {
        console.log(e)
        return { success: false, error: e.toString() }
    }
}
