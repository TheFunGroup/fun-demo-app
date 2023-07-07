/* eslint-disable eqeqeq */
/* eslint-disable react/prop-types */
import { formatEther } from "ethers/lib/utils.js"
import Image from "next/image"
import { useRouter } from "next/router"
import React, { useCallback, useEffect, useState } from "react"
import { useFun } from "../../contexts/funContext"
import { toUSD } from "../../scripts/prices"
import { handleStakeEth } from "../../scripts/stake"
import { getEtherBalance, checkAndHandleUserRejectionsMessage } from "../../scripts/wallet"
import { tokens } from "../../utils/tokens"
import PaymentMethod from "../forms/PaymentMethod"
import StakeForm from "../forms/StakeForm"
import Spinner from "../misc/Spinner"
import { BigNumber } from "ethers"

const examples = {
    stake: {
        title: "Stake",
        description: "Stake to earn rewards. Longer staking earn more rewards.",
        submit: "Stake"
    }
}

const weiToEther = (wei) => {
    return formatEther(BigNumber.from(wei.toString()))
}
// Page should maybe display the Current network connected or used.

// some requirements for staking
// must verify the user is on the correct chain. support chain 5 ONLY for now
// must verify that the user has enough funds to pay for the gas given they are paying
// TODO Test Gasless and ERC20 payment staking
export default function StakingModal(props) {
    const router = useRouter()
    const example = examples[props.example]

    const { wallet, eoa, setLoading, paymentToken, setPaymentToken, setPaymentAddr, setPaymasterAddress, network } = useFun()

    const [mustFund, setMustFund] = useState(false)
    const [mustApprove, setMustApprove] = useState(false)

    const [stakeInput, setStakeInput] = useState("0.0")
    const [ethBalance, setEthBalance] = useState("loading")
    const [gas, setGas] = useState("Calculating...")
    const [submitReady, setSubmitReady] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState()

    const handleSubmit = useCallback(() => {
        // Validate params
        if (network !== 5) {
            setError("Please connect to the Goerli Ethereum.")
            return
        }
        if (ethBalance === "0") return
        if (ethBalance < parseFloat(stakeInput)) {
            setError("Insufficient ETH balance.")
            return
        }
        if (submitting) return
        setSubmitting(true)
        setLoading(true)

        if (parseFloat(stakeInput) <= 0) {
            setError("Please enter a valid amount.")
            return
        }

        let normalizedPaymentToken = paymentToken
        if (paymentToken !== "gasless" && paymentToken !== "ETH") {
            for (let i = 0; i < tokens[5].length; i++) {
                if (tokens[5][i].name === paymentToken) {
                    normalizedPaymentToken = tokens[5][i].addr
                }
            }
        }
        // eslint-disable-next-line eqeqeq
        if (normalizedPaymentToken == null) return
        // Handle Staking
        handleStakeEth(wallet, normalizedPaymentToken, stakeInput, eoa)
            .then((res) => {
                if (!res.success) {
                    if (res.mustFund) {
                        setMustFund(true)
                    } else if (res.mustApprove) {
                        setPaymentAddr(res.tokenAddr)
                        setPaymasterAddress(res.paymasterAddress)
                        setMustApprove(true)
                    } else {
                        checkAndHandleUserRejectionsMessage(res.error, setError)
                    }
                } else {
                    router.push({
                        pathname: "/transaction",
                        query: {
                            title: "Stake",
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
            })
            .catch(() => {
                setError("Error submitting transaction.")
                setSubmitting(false)
                setLoading(false)
            })
    }, [network, ethBalance, stakeInput, submitting, setLoading, paymentToken, wallet, eoa, setPaymentAddr, setPaymasterAddress, router])

    const FetchGas = useCallback(async () => {
        if (paymentToken !== "gasless") {
            if (stakeInput === "0.0") return // don't estimate gas for 0 value transactions.
            let normalizedPaymentToken = paymentToken
            if (paymentToken !== "ETH") {
                for (let i = 0; i < tokens[5].length; i++) {
                    if (tokens[5][i].name === paymentToken) {
                        normalizedPaymentToken = tokens[5][i].addr
                    }
                }
            }
            handleStakeEth(wallet, normalizedPaymentToken, stakeInput, eoa, true)
                .then(async (estimate) => {
                    if (estimate.success) {
                        console.log(estimate.receipt, weiToEther(estimate.receipt))
                        const usd = await toUSD(paymentToken, weiToEther(estimate.receipt))
                        setGas(`${parseFloat(weiToEther(estimate.receipt)).toFixed(10)} ${paymentToken} · $${usd}`)
                    } else {
                        console.log("error: ", estimate)
                        if (estimate.mustApprove) {
                            setPaymentAddr(estimate.tokenAddr)
                            setPaymasterAddress(estimate.paymasterAddress)
                            setMustApprove(true)
                        }
                    }
                })
                .catch((e) => {
                    console.log(e)
                })
        } else {
            setGas("$0.00")
        }
    }, [paymentToken, stakeInput, wallet, eoa, setPaymentAddr, setPaymasterAddress])
    // fetch the Ether balance and refresh every 30 seconds
    useEffect(() => {
        // fetch balance on page load once
        if (wallet && ethBalance === "loading") {
            wallet
                .getAddress()
                .then((addr) => {
                    if (addr == null) return
                    getEtherBalance(addr)
                        .then((balance) => {
                            const roundedEther = Math.round(parseFloat(formatEther(balance)) * 100000) / 100000
                            setEthBalance(roundedEther)
                        })
                        .catch(() => {
                            setError("Error getting balance.")
                        })
                })
                .catch(() => {
                    setError("Error getting address.")
                })
        }
        // keep refreshing every 30 seconds.
        const refresh = setInterval(() => {
            wallet
                .getAddress()
                .then((addr) => {
                    if (addr == null) return
                    getEtherBalance(addr)
                        .then((balance) => {
                            const roundedEther = Math.round(parseFloat(formatEther(balance)) * 100000) / 100000
                            setEthBalance(roundedEther)
                        })
                        .catch((e) => {
                            console.log(e)
                            setError("Error refetching balance.")
                        })
                })
                .catch(() => {
                    setError("Error getting address.")
                })
        }, 30000)
        return () => clearInterval(refresh)
    }, [ethBalance, wallet])

    //// determine the gas cost and convert to USD
    useEffect(() => {
        FetchGas()
        if (stakeInput > 0) {
            setSubmitReady(true)
        } else {
            setSubmitReady(false)
        }
    }, [FetchGas, eoa, paymentToken, setPaymasterAddress, setPaymentAddr, stakeInput, wallet])

    // reset the fund and approve states if the payment token changes
    useEffect(() => {
        setMustFund(false)
        setMustApprove(false)
        setLoading(false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paymentToken])

    return (
        <div className={"modal w-[690px] my-12 font-sfpro"}>
            {mustFund && (
                <div className="alert w-full flex justify-between -mb-[80px] relative">
                    <div className="flex items-center">
                        <Image src="/alert.svg" width="24" height="24" alt="" />
                        <div className="text-[#101828] font-medium ml-3">{`Insufficient ${paymentToken} for transaction fees.`}</div>
                    </div>
                    <div className="button text-center px-[18px] py-[10px]" onClick={() => router.push("/fund?example=stake")}>
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
            <div className="flex justify-between items-start w-full">
                <div>
                    <div className="text-[#101828] font-semibold text-xl">{example.title}</div>
                    <div className="text-[#667085] text-sm mt-1 mb-10 whitespace-nowrap">{example.description}</div>
                </div>
                {/* <div className="flex items-start"> {networks[network]?.name}</div> */}
            </div>

            <div className="rounded-lg border-[1px] border-[#E5E5E5] w-full mt-1 mb-10 bg-white">
                <div className="flex justify-between items-center w-full p-3">
                    <div className="flex items-start">
                        <Image src="/alert-grey.svg" width="16" height="16" alt="Warning" className="mt-1 mx-2" />
                        <div className="flex flex-col justify-start ml-1">
                            <div className="text-[#101828] font-medium text-base">Use Swap</div>
                            <div className="text-xs text-[#667085]">
                                {" "}
                                At the current rate of stETH, it may be more profitable to swap instead of stake. Consider using the swap?
                            </div>
                        </div>
                    </div>
                    <div
                        className="flex items-center border-[1px] border-[#E5E5E5] rounded-lg px-5 py-3 text-[#667085] text-sm hover:bg-[#E5E5E5] cursor-pointer font-sfpro"
                        onClick={() => {
                            // q: "how to receive query objects in nextjs?"
                            // a: "use router.query"

                            router.push("/swap", { stake: stakeInput })
                        }}>
                        Swap
                    </div>
                </div>
            </div>
            <StakeForm setStakeInput={setStakeInput} stakeInput={stakeInput} balance={ethBalance} />

            <PaymentMethod token={paymentToken} setToken={setPaymentToken} />

            <div className="flex flex-col mt-10 w-full justify-start">
                <div className="font-semibold text-base">Transaction Details</div>
                <div className="flex justify-between w-full  text-sm mt-3">
                    <div className="text-[#344054] font-medium">Staking APR</div>
                    <div className="text-[#667085]">{"5.4%"}</div>
                </div>
                <div className="flex justify-between w-full mt-1 text-sm">
                    <div className="text-[#344054] font-medium">Gas</div>
                    <div className="text-[#667085]">{`${gas}`}</div>
                </div>
            </div>

            <div className="flex w-full items-center justify-between mt-10 text-center">
                <div className="w-[315px] button p-3 font-medium text-[#344054]" onClick={() => router.push("/")}>
                    Cancel
                </div>
                <div
                    className="w-[315px] button-dark p-3 font-medium flex items-center justify-center"
                    onClick={handleSubmit}
                    style={!submitReady || submitting ? { opacity: 0.8, pointerEvents: "none" } : {}}>
                    <div className={submitting ? "mr-2" : ""}>{examples[props.example].submit}</div>
                    {submitting && <Spinner />}
                </div>
            </div>
        </div>
    )
}
