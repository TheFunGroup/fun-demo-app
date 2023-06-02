import { ethers } from "ethers"
import Image from "next/image"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { Eoa } from "../../../fun-wallet/dist/src/auth"
import { useFun } from "../../contexts/funContext"
import { handleBridge } from "../../scripts/bridge"
import { getERC20Balance, getEtherBalance, isContract } from "../../scripts/wallet"
import { networks } from "../../utils/networks"
import { tokens } from "../../utils/tokens"
import BridgeForm from "../forms/BridgeForm"
import PaymentMethod from "../forms/PaymentMethod"
import Spinner from "../misc/Spinner"
const BridgeModalConfig = {
    title: "Bridge",
    description: "Bridge your tokens from one blockchain to another. Bridging can take some time to complete, so please be patient.",
    submit: "Bridge"
}

const fetchTokenBalances = (address, network, bridgeAsset) => {
    return new Promise(async (resolve, reject) => {
        if (tokens[network] == null || networks[network].rpcUrls[0] == null) {
            reject({ ...bridgeAsset, balance: "N/A" })
            return
        }
        const etherProvider = new ethers.providers.JsonRpcProvider(networks[network].rpcUrls[0])

        let bridgeAssetAddr = tokens[network][0].addr
        for (let i = 0; i < tokens[network].length; i++) {
            if (tokens[network][i].name == bridgeAsset.name) {
                console.log("found bridgeAsset", tokens[network][i].name, bridgeAsset)
                bridgeAssetAddr = tokens[network][i].addr
                break
            }
        }

        if (bridgeAssetAddr === "native") {
            console.log("fetching native balance")
            const balance = await getEtherBalance(address, etherProvider)
            const etherBalance = ethers.utils.formatEther(balance)
            const formatedEtherBalance = Math.floor(parseFloat(etherBalance) * 10000) / 10000
            resolve({ ...bridgeAsset, balance: formatedEtherBalance })
        } else {
            console.log("fetching erc20 balance")
            const balance = await getERC20Balance(address, bridgeAssetAddr, etherProvider)
            resolve({ ...bridgeAsset, balance: balance.value })
        }
    })
}

const checkIfWalletExistsOnNetwork = (address, network, wallet, provider) => {
    return new Promise(async (resolve, reject) => {
        if (networks[network].rpcUrls[0] == null) {
            reject({ ...bridgeAsset, balance: "N/A" })
            return
        }
        const etherProvider = new ethers.providers.JsonRpcProvider(networks[network].rpcUrls[0])
        const initialized = isContract(address, etherProvider)
        if (initialized) {
            resolve(wallet)
        } else {
            const auth = new Eoa(provider)
            const funWallet = await createFunWallet(auth, network)
            resolve(funWallet)
        }
    })
}

// TODO implement the cancel button to switch chains automatically and figure out why its buging out.

export default function Bridge(props) {
    const router = useRouter()

    const { wallet, setWallet, eoa, setNetwork, setLoading, paymentToken, setPaymentToken, provider } = useFun()

    const [mustFund, setMustFund] = useState(false)
    const [mustApprove, setMustApprove] = useState(false)
    const [fromNetwork, setFromNetwork] = useState(137)
    const [toNetwork, setToNetwork] = useState(42161)
    const [bridgeAsset, setBridgeAsset] = useState({ name: "MATIC", amount: 0, balance: "loading" })
    const [bridgeOutAsset, setBridgeOutAsset] = useState({ name: "ETH", amount: 0, balance: "loading" })

    const [ethBalance, setEthBalance] = useState("100" || "loading")
    const [loadingBalance, setLoadingBalance] = useState(false)
    const [gas, setGas] = useState("Calculating...")
    const [submitReady, setSubmitReady] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState()

    async function handleSubmit() {
        // validate params
        if (parseFloat(bridgeAsset.amount) <= 0) {
            setError("Please enter a valid amount.")
            return
        }
        if (ethBalance == "0") return
        if (ethBalance < parseFloat(bridgeAsset.amount)) {
            setError("Insufficient balance.")
            return
        }
        if (submitting) return
        setSubmitting(true)
        setLoading(true)

        // Handle bridge
        // verify the params
        /*
         *   fromChainId: number (chain id you are bridging the asset from)
         *   toChainId: number (chain id you are bridging the asset to)
         *   fromAssetAddress: string (address of the asset on fromChainId's chain)
         *   toAssetAddress: string (address of the asset you want to receive on toChainId's chain)
         *   amount: number (amount of the from asset you want to input - make sure to take decimals into account)
         * **/
        const res = await handleBridge(wallet, provider, eoa, "ETH", {}, eoa)
        if (!res.success) {
            if (res.mustFund) {
                setMustFund(true)
            } else if (res.mustApprove) {
                setMustApprove(true)
            } else {
                setError(res.error)
            }
        } else {
            router.push({
                pathname: "/transaction",
                query: {
                    title: "Bridge",
                    valueIn: stakeInput,
                    tokenIn: "ETH",
                    valueOut: stakeInput,
                    tokenOut: "stETH",
                    explorerURL: res.explorerUrl
                }
            })
        }
        setSubmitting(false)
        setLoading(false)
    }

    // fetch the current balance of the selected token on the correct chain.
    useEffect(() => {
        if (wallet == null || loadingBalance) return
        setLoadingBalance(true)
        wallet
            .getAddress()
            .then(async (addr) => {
                console.log("fetching balances for ", addr, "on ", fromNetwork)
                Promise.all([fetchTokenBalances(addr, fromNetwork, bridgeAsset), fetchTokenBalances(addr, toNetwork, bridgeOutAsset)])
                    .then((res) => {
                        if (res[0].balance == "N/A" || res[1].balance == "N/A") {
                            setError("Invalid network selected.")
                            return
                        }
                        console.log(res)
                        if (res[0] && res[0].balance) {
                            setBridgeAsset(res[0])
                        }
                        if (res[1] && res[1].balance) {
                            setBridgeOutAsset(res[1])
                        }
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            })
            .catch((err) => {
                console.log(err)
            })
    }, [wallet, fromNetwork, bridgeAsset, loadingBalance, toNetwork, bridgeOutAsset])

    // Ensures that the chainId is always set to the from Network selector.
    useEffect(() => {
        if (provider == null) return
        provider
            .getChainId()
            .then((chainId) => {
                if (chainId != fromNetwork) {
                    provider
                        .switchChain(Number(fromNetwork))
                        .then((r) => {
                            setNetwork(fromNetwork)
                            setBridgeAsset({ ...bridgeAsset, balance: "loading" })
                            setLoadingBalance(false)
                            if (paymentToken == "ETH" && networks[fromNetwork].nativeCurrency.symbol != "ETH") {
                                setPaymentToken(networks[fromNetwork].nativeCurrency.symbol)
                            }
                            // check if there is a fun wallet at this address on the new network.
                            // if not, create one.
                            checkIfWalletExistsOnNetwork(wallet.address, fromNetwork, wallet, provider)
                                .then((funWallet) => {
                                    console.log(funWallet)
                                    if (funWallet.address != wallet.address) {
                                        setWallet(funWallet)
                                    }
                                })
                                .catch((err) => {
                                    console.log(err)
                                })
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }, [provider, fromNetwork])

    useEffect(() => {
        setMustFund(false)
        setMustApprove(false)
    }, [paymentToken])

    useEffect(() => {
        setLoading(false)
    }, [])

    useEffect(() => {
        if (bridgeAsset.amount > 0 && !submitReady) setSubmitReady(true)
    }, [bridgeAsset, submitReady])

    return (
        <div className={`modal w-[690px] font-sfpro ${props.example == "swap" ? "my-8" : "my-12"}`}>
            {mustFund && (
                <div className="alert w-full flex justify-between -mb-[80px] relative">
                    <div className="flex items-center">
                        <Image src="/alert.svg" width="24" height="24" alt="" />
                        <div className="text-[#101828] font-medium ml-3">{`Insufficient ${paymentToken} for transaction fees.`}</div>
                    </div>
                    <div className="button text-center px-[18px] py-[10px]" onClick={() => router.push(`/fund?example=${props.example}`)}>
                        Fund
                    </div>
                </div>
            )}

            {mustApprove && (
                <div className="alert w-full flex justify-between -mb-[80px] relative">
                    <div className="flex items-center">
                        <Image src="/alert.svg" width="24" height="24" alt="" />
                        <div className="text-[#101828] font-medium ml-3">
                            {"Token Sponsor doesn’t have the required authorization amount."}
                        </div>
                    </div>
                    <div
                        className="button text-center px-[18px] py-[10px]"
                        onClick={() => router.push(`/approve?example=${props.example}`)}>
                        Give
                    </div>
                </div>
            )}

            {error && (
                <div className="alert w-full flex justify-between -mb-[80px] relative">
                    <div className="flex">
                        <Image src="/alert.svg" width="24" height="24" alt="" className="max-h-[24px]" />
                        <div className="text-[#101828] font-medium ml-3">{error}</div>
                    </div>
                    <Image
                        src="/close.svg"
                        width="24"
                        height="24"
                        alt=""
                        className="max-h-[24px] cursor-pointer hover:opacity-75"
                        onClick={() => setError(null)}
                    />
                </div>
            )}

            <div
                className="text-[#101828] font-semibold text-xl"
                onClick={() => {
                    setLoadingBalance(false)
                }}>
                {BridgeModalConfig.title}
            </div>
            <div className="text-[#667085] text-sm mt-1 mb-10 ">{BridgeModalConfig.description}</div>

            {props.example == "bridge" && (
                <BridgeForm
                    fromNetwork={fromNetwork}
                    setFromNetwork={setFromNetwork}
                    toNetwork={toNetwork}
                    setToNetwork={setToNetwork}
                    bridgeAsset={bridgeAsset}
                    setBridgeAsset={setBridgeAsset}
                    bridgeOutAsset={bridgeOutAsset}
                    setBridgeOutAsset={setBridgeOutAsset}
                />
            )}

            <PaymentMethod token={paymentToken} setToken={setPaymentToken} />

            <div className="flex flex-col mt-10 w-full justify-start">
                <div className="font-semibold text-base">Transaction Details</div>
                <div className="flex justify-between w-full  text-sm mt-3">
                    <div className="text-[#344054] font-medium">Estimated Time</div>
                    <div className="text-[#667085]">{"~3 minutes"}</div>
                </div>
                <div className="flex justify-between w-full mt-3 text-sm">
                    <div className="text-[#344054] font-medium">Gas</div>
                    <div className="text-[#667085]">{`${gas}`}</div>
                </div>
            </div>

            <div className="flex w-full items-center justify-between mt-10 text-center">
                <div
                    className="w-[315px] button p-3 font-medium text-[#344054]"
                    onClick={() => {
                        console.log("switching chain", provider)
                        provider
                            .switchChain(5)
                            .then((r) => {
                                console.log(r)
                                setNetwork(5)
                                setPaymentToken("ETH")
                                router.push("/")
                            })
                            .catch((err) => {
                                console.log(err)
                            })
                    }}>
                    Cancel
                </div>
                <div
                    className="w-[315px] button-dark p-3 font-medium flex items-center justify-center"
                    onClick={handleSubmit}
                    style={!submitReady || submitting ? { opacity: 0.8, pointerEvents: "none" } : {}}>
                    <div className={submitting ? "mr-2" : ""}>{BridgeModalConfig.submit}</div>
                    {submitting && <Spinner />}
                </div>
            </div>
        </div>
    )
}
