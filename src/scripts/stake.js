import { ethers } from "ethers"
import { getERC20Balance, isContract } from "./wallet"
import { configureEnvironment } from "../../fun-wallet/dist/config"
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
        let envOptions = {
            chain: 5,
            apiKey,
            gasSponsor: false
        }
        // Tells frontend that funwallet must be funded
        if (paymentToken != "ETH" && paymentToken != "gasless") {
            //use paymaster
            envOptions = {
                chain: 5,
                apiKey,
                gasSponsor: {
                    sponsorAddress: "0x07Ac5A221e5b3263ad0E04aBa6076B795A91aef9",
                    token: paymentToken
                }
            }
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
            envOptions = {
                chain: 5,
                apiKey,
                gasSponsor: {
                    sponsorAddress: "0x07Ac5A221e5b3263ad0E04aBa6076B795A91aef9"
                }
            }
        }
        // try {
        const receipt = await wallet.stake(auth, { amount }, envOptions, estimateGas)
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

export const handleUnstakeEth = async function (wallet, paymentToken, amount, auth, estimateGas = false) {
    if (!wallet) return { success: false, error: "Wallet not initialized" }
    if (!auth) return { success: false, error: "Auth not initialized" }
    try {
        const signer = await auth.getSigner()
        const walletAddress = await wallet.getAddress()
        const stEthBalance = await getERC20Balance(walletAddress, "0x1643e812ae58766192cf7d2cf9567df2c37e9b7f")
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

        // convert amount into an Array in WEI
        const amountInWei = ethers.utils.parseEther(amount.toString())
        // handle unstake start

        const result = await wallet.unstake(
            auth,
            { amounts: [amountInWei.toString()], recipient: walletAddress },
            { chain: 5, apiKey, gasSponsor: false, gasLimit: 300000, sendLater: true },
            estimateGas
        )
        console.log(result)
        // check the wallet balance of stETH and make sure its less than amount using ethers
    } catch (e) {
        console.log(e)
        return { success: false, error: e.toString() }
    }
}

export const getUnstakeRequests = async function (wallet) {
    const requests = await wallet.getAssets(false, true)
    console.log(requests)
}
