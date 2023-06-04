import { ethers } from "ethers"
import { FunWallet, configureEnvironment, TokenSponsor, Token } from "fun-wallet"
import { getStoredUniqueId } from "fun-wallet/utils"
import { handleFundWallet } from "../scripts/fund"
import { apiKey } from "../utils/constants"
import erc20Abi from "../utils/erc20Abi"
import { tokens } from "../utils/tokens"
const options = {
    chain: 5,
    apiKey
}

const WALLET_INDEX = 34788

export async function createFunWallet(auth, chainId) {
    await configureEnvironment({ ...options, chain: chainId })
    const uniqueId = await auth.getUniqueId()
    const wallet = new FunWallet({ uniqueId, index: WALLET_INDEX })
    const addr = await wallet.getAddress()
    wallet.address = addr
    return wallet
}

export const isContract = async (address, provider) => {
    if (!provider) provider = new ethers.providers.JsonRpcProvider("https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161")
    try {
        const code = await provider.getCode(address)
        if (code == "0x") return false
        return true
    } catch (error) {
        return false
    }
}

export const isAuthIdUsed = async (authId) => {
    try {
        await configureEnvironment(options)
        const uniqueId = await getStoredUniqueId(authId)
        if (uniqueId) {
            return true
        } else {
            return false
        }
    } catch (error) {
        console.log("isAuthIdUsed error: ", error)
        return false
    }
}

export async function fundUsingFaucet(addr, network) {
    if (network == 5) {
        //GOERLI
        try {
            await handleFundWallet(addr)
            setTimeout(() => {
                return
            }, 1500)
        } catch (e) {}
    } else if (network == 1) {
        //MAINNET
        try {
        } catch (e) {}
    } else if (network == 137) {
        //POLYGON
        try {
        } catch (e) {}
    } else if (network == 56) {
        //BSC
        try {
        } catch (e) {}
    }
}

export async function getAddress(uniqueId, chainId, index = WALLET_INDEX, apiKey = options.apiKey) {
    try {
        const addr = await FunWallet.getAddress(uniqueId, index, chainId, apiKey)
        return addr
    } catch (e) {
        return false
    }
}

export const checkWalletPaymasterConfig = async (wallet, paymentToken, chainIdNumber) => {
    try {
        const walletAddress = await wallet.getAddress()
        if (paymentToken === "ETH") {
            return {
                success: true,
                envOptions: {
                    chain: chainIdNumber,
                    apiKey,
                    gasSponsor: false
                }
            }
        } else if (paymentToken === "gasless") {
            console.log("using gasless")
            return {
                success: true,
                envOptions: {
                    chain: chainIdNumber,
                    apiKey,
                    gasSponsor: {
                        sponsorAddress: "0x07Ac5A221e5b3263ad0E04aBa6076B795A91aef9"
                    }
                }
            }
        } else {
            //use paymaster
            let normalizedTokenAddress = paymentToken
            const paymentTokenContract = await isContract(paymentToken)
            if (!paymentTokenContract) {
                console.log("finding address")
                for (let token in tokens[chainIdNumber]) {
                    if (tokens[chainIdNumber][token].name === paymentToken) {
                        normalizedTokenAddress = tokens[chainIdNumber][token].addr
                        break
                    }
                }
            }
            const gasSponsor = new TokenSponsor({
                chain: chainIdNumber,
                apiKey,
                gasSponsor: {
                    sponsorAddress: "0x07Ac5A221e5b3263ad0E04aBa6076B795A91aef9",
                    token: normalizedTokenAddress
                }
            })
            const provider = new ethers.providers.JsonRpcProvider("https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161")
            const paymasterAddress = await gasSponsor.getPaymasterAddress()
            const erc20Contract = new ethers.Contract(normalizedTokenAddress, erc20Abi, provider)

            const iscontract = await isContract(walletAddress)
            if (iscontract) {
                let allowance = await erc20Contract.allowance(walletAddress, paymasterAddress) //paymaster address
                allowance = ethers.utils.formatUnits(allowance, 6)
                if (Number(allowance) < Number(20)) {
                    //amt
                    //if approved, pop up modal, and ask for approval
                    return { success: false, mustApprove: true, paymasterAddress, tokenAddr: normalizedTokenAddress }
                }
            } else {
                return {
                    success: false,
                    error: "Its a known bug that first transaction of a fun wallet would fail if you are covering gas using ERC20 tokens. Please try to pay gas using gasless paymaster or ETH for this transaction and try token paymaster later."
                }
            }
            return {
                success: true,
                envOptions: {
                    chain: chainIdNumber,
                    apiKey,
                    gasSponsor: {
                        sponsorAddress: "0x07Ac5A221e5b3263ad0E04aBa6076B795A91aef9",
                        token: paymentToken
                    }
                }
            }
        }
    } catch (err) {
        console.log(err)
        return { success: false, error: err }
    }
}

// check if the wallet is deployed
// check if the wallet has enough funds and if not fund the wallet
export const checkIfWalletIsPrefunded = async (wallet, estimatedGas, chainId, native = true) => {
    if (!native) return { success: true }
    try {
        const walletAddress = await wallet.getAddress()
        const etherBalance = await Token.getBalance("ETH", walletAddress)
        const balance = ethers.utils.parseEther(etherBalance)
        console.log("balance", balance.toString(), "estimatedGas", estimatedGas.toString())
        if (balance < estimatedGas) {
            await fundUsingFaucet(walletAddress, chainId)
            return { success: false, error: "Insufficient balance try again in a minute" }
        }
        return { success: true }
    } catch (err) {
        console.log(err)
        return { success: false, error: err }
    }
}

export const checkAndHandleUserRejectionsMessage = (err, handlerFunc) => {
    console.log(err)
    if (err.slice && err.slice(0, 28) === "Error: user rejected signing") {
        handlerFunc("User rejected Transaction.")
    } else {
        handlerFunc(JSON.stringify(err))
    }
}

export const getEtherBalance = (
    walletAddress,
    provider = new ethers.providers.JsonRpcProvider("https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161")
) => {
    return new Promise((resolve, reject) => {
        if (walletAddress == null) return reject("No wallet address provided")
        provider
            .getBalance(walletAddress)
            .then((balance) => {
                resolve(balance)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

export const getERC20Balance = (
    walletAddress,
    erc20Address,
    provider = new ethers.providers.JsonRpcProvider("https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161")
) => {
    return new Promise((resolve, reject) => {
        if (walletAddress == null) return reject("No wallet address provided")
        if (erc20Address == null) return reject("No token address provided")
        const contract = new ethers.Contract(erc20Address, erc20Abi, provider)
        contract
            .balanceOf(walletAddress)
            .then((balance) => {
                resolve({ value: balance, key: erc20Address })
            })
            .catch((err) => {
                reject({ error: err, key: erc20Address })
            })
    })
}
