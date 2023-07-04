import { BigNumber } from "ethers"
import { formatEther } from "ethers/lib/utils.js"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { useFunUtils } from "../../contexts/funContext"
import { toUSD } from "../../scripts/prices"
import { getBlockTimestamp, getTransactionStatus, unixTimestampToDate } from "../../scripts/transactons"
import NetworkDisplay from "../misc/NetworkDisplay"

const LIDO_TOKEN_TRANSFER_TOPIC = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"

const TransactionStatusRow = (props) => {
    let title = (
        <div className="flex justify-start items-center">
            <div className="w-7 h-7 bg-bg-300 flex items-center justify-center rounded-full">
                <Image src={props.img} width="14" height="14" alt={props.title} />
            </div>
            <div className={"text-textBlue-200 text-base font-regular px-4"}>{props.title}</div>
        </div>
    )
    if (props.title === "Pending") {
        title = (
            <div className="flex justify-start items-center">
                <div className="w-7 h-7 bg-bg-300 flex items-center justify-center rounded-full relative">
                    <div className="w-[10px] h-[10px] animate-pulse bg-textBlue-200 rounded-full"></div>
                </div>
                <div className={"text-textBlue-200 text-base font-regular px-4 animate-pulse"}>{props.title}</div>
            </div>
        )
    }
    if (props.title === "Pending" && props.status === "completed") {
        title = (
            <div className="flex justify-start items-center">
                <div className="w-7 h-7 bg-bg-300 flex items-center justify-center rounded-full relative">
                    <Image src={"Tick.svg"} width="14" height="14" alt={props.title} />
                </div>
                <div className={"text-textBlue-200 text-base font-regular px-4"}>Confirmed</div>
            </div>
        )
    }

    if (props.title === "Completed" && props.status !== "completed") {
        title = (
            <div className="flex justify-start items-center opacity-70">
                <div className="w-7 h-7  flex items-center justify-center rounded-full">
                    <div className="w-[10px] h-[10px] bg-text-100 rounded-full"></div>
                </div>
                <div className={"text-text-100 text-base font-regular px-4 "}>{props.title}</div>
            </div>
        )
    }

    return (
        <div className="flex w-full justify-between items-center">
            {title}
            <div className="flex ">
                {props.date && props.time ? (
                    <>
                        {" "}
                        <div className="text-text-100 text-base">{props.date || "-- -- --"}</div>
                        <div className="text-text-100 text-base px-2">{" · "}</div>
                        <div className="text-text-200 text-base font-medium">{props.time || "-- --"}</div>
                    </>
                ) : (
                    <div className="text-text-200 text-base font-medium">{props.time || "-- --"}</div>
                )}
            </div>
        </div>
    )
}
const TransactionSeperator = (props) => {
    if (props.title === "final" && props.status !== "completed") {
        return (
            <div className="flex justify-center items-center w-[28px] animate-pulse">
                <div className="w-[2px] h-6 bg-[#E4E7EC] my-2" />
            </div>
        )
    }
    return (
        <div className="flex justify-center items-center w-[28px]">
            <div className="w-[2px] h-6 bg-textBlue-200 my-2" />
        </div>
    )
}

const handleTokenSpecificLogs = (txReceipt, tokenOut, valueOut) => {
    if (tokenOut === "stETH" && txReceipt != null && txReceipt.logs != null) {
        for (let i = 0; i < txReceipt.logs.length; i++) {
            if (txReceipt.logs[i].topics[0] === LIDO_TOKEN_TRANSFER_TOPIC) {
                // find the TOPIC where LIDO tokens are transfered to the user to determin how many tokens were transfered
                const unformatedEtherValue = formatEther(BigNumber.from(txReceipt.logs[i].data || "0"))
                return Math.floor(parseFloat(unformatedEtherValue) * 1000000) / 1000000
            }
        }
    }
    return valueOut
}

//
const TransactionStatusModal = (props) => {
    const router = useRouter()
    const { wallet, setLoading } = useFunUtils()
    const [tx, setTx] = useState(null)
    const [blockStartTime, setBlockStartTime] = useState(0) // [blockNumber, timestamp
    const [inputPrice, setInputPrice] = useState(null)
    const [outPrice, setOutPrice] = useState(null)
    const [txStatus, setTxStatus] = useState("started")
    const [tokenOUT, setTokenOUT] = useState("loading")
    const { title, valueIn, tokenIn, networkIn, valueOut, tokenOut, networkOut, explorerURL, prevStEthBalance } = router.query

    // hook to get transaction status data and update it every 5 seconds as well as load the block timestamp
    useEffect(() => {
        // check if its even possible to get the txHash
        if (explorerURL?.slice(explorerURL.length - 11, explorerURL.length) === "#internaltx") {
            // "https://goerli.etherscan.io/address/0x378e76ec2f0370423845ed7c922f79b9479c179b#internaltx"
            // SDK did not return a txHash, so we can't get the transaction status link to the blockchain explorer only
            setTxStatus("lost")
            return
        }
        const txHash = explorerURL?.split("/").pop()
        getTransactionStatus(txHash || "0xf32673f7e74f0ed5c444f3bac74e268073679c8233e4ef276d4e9b0aa7ea8240")
            .then((res) => {
                setTx(res)
                setTokenOUT(handleTokenSpecificLogs(res, tokenOut, valueOut))
                getBlockTimestamp(res.blockNumber)
                    .then((time) => {
                        const date = unixTimestampToDate(time)
                        setBlockStartTime(date)
                    })
                    .catch((err) => {
                        setBlockStartTime("unkown")
                    })
            })
            .catch((err) => {
                setTxStatus("error: ", err)
            })

        const txStatusInterval = setInterval(() => {
            getTransactionStatus(txHash || "0xf32673f7e74f0ed5c444f3bac74e268073679c8233e4ef276d4e9b0aa7ea8240")
                .then((res) => {
                    setTx(res)
                })
                .catch((err) => {
                    setTxStatus("error: ", err)
                })
        }, 5000)

        return () => clearInterval(txStatusInterval)
    }, [explorerURL, tokenOut, valueOut])

    useEffect(() => {
        if (tx && txStatus === "started") {
            setTxStatus("pending")
            if (tx.status !== 1) {
                setTxStatus("error")
            }
        }
        if (tx && tx.confirmations >= 5) {
            setTxStatus("completed")
        }
    }, [setLoading, tx, txStatus])

    // effect for getting the input and output prices
    useEffect(() => {
        // if (!valueIn || !valueOut) return;
        if (inputPrice == null && outPrice == null) return
        if (tokenOUT === "loading") return
        Promise.all([toUSD(tokenIn || "eth", valueIn || "0.1"), toUSD(tokenOUT || "steth", valueOut || "0.1")])
            .then((prices) => {
                console.log(prices)
                setInputPrice(prices[0])
                setOutPrice(prices[1])
            })
            .catch((err) => {
                console.log(err)
            })
    }, [inputPrice, outPrice, tokenIn, tokenOUT, tokenOut, valueIn, valueOut])

    useEffect(() => {
        if (title === "Staking") {
        }
    })
    return (
        <div className={"modal w-[690px] my-12 font-sfpro"}>
            <div className="flex justify-between items-start w-full">
                <div>
                    <div className="text-[#101428] font-semibold text-xl px-6 pt-6">{title || "Staking"}</div>
                </div>
            </div>

            <div className="w-full flex justify-between items-center mt-2 p-6">
                <div className="flex flex-col items-start justify-evenly w-1/3 min-h-[148px]">
                    <div className="text-text-100 text-base mb-2">From</div>
                    {!(networkIn && networkOut) ? (
                        <NetworkDisplay token={tokenIn || "ETH"} size="32" classes={" text-xl max-w-[142px] h-[48px]"} />
                    ) : (
                        <NetworkDisplay network={networkIn || "ethereum"} size="32" classes={" text-xl max-w-[142px] h-[48px]"} />
                    )}
                    <span className={"text-text-300 text-3xl font-regular mt-3"}>{valueIn || "0.001"}</span>
                    <span className={"text-text-100 text-base font-regular mt-1"}>{`$${inputPrice || "0.00"}`}</span>
                </div>
                <div className="flex flex-col items-start justify-evenly w-1/3 min-h-[148px]">
                    <div className="text-text-100 text-base mb-2">To</div>
                    {!(networkIn && networkOut) ? (
                        <NetworkDisplay token={tokenOut || "ETH"} size="32" classes={" text-xl max-w-[142px] h-[48px]"} />
                    ) : (
                        <NetworkDisplay network={networkOut || "arbitrum"} size="32" classes={" text-xl max-w-[142px] h-[48px]"} />
                    )}
                    <span className={"text-text-300 text-3xl font-regular mt-3"}>{tokenOUT || "0.001"}</span>
                    <span className={"text-text-100 text-base font-regular mt-1"}>{`$${outPrice || "0.00"}`}</span>
                </div>
            </div>

            <div className="w-full flex flex-col justify-start items-start mt-2 p-6">
                <div className="text-text-100 text-base">Status</div>
                <div className="flex flex-col items-start justify-evenly w-full mt-6">
                    {txStatus === "lost" ? (
                        <TransactionStatusRow title="Error" img="/alert.svg" date={""} time={"Transaction hash missing"} />
                    ) : (
                        <>
                            <TransactionStatusRow title="Submitted" img="/Tick.svg" date={blockStartTime.date} time={blockStartTime.time} />
                            <TransactionSeperator />
                            <TransactionStatusRow
                                title="Pending"
                                status={txStatus}
                                img="/chevron.svg"
                                time={` ${tx?.confirmations || "0"} confirmations`}
                            />
                            <TransactionSeperator title={"final"} status={txStatus} />
                            <TransactionStatusRow title="Completed" status={txStatus} img="/Tick.svg" time=" " />
                        </>
                    )}
                </div>
            </div>
            <div className="w-full flex justify-between items-center mt-2 p-6 ">
                <Link
                    href={"/"}
                    className="flex flex-col items-center button justify-evenly w-[290px] h-12 bg-white border-[1px] border-[#D0D5DD] rounded-lg shadow-sm cursor-pointer">
                    <span>Back</span>
                </Link>
                <Link
                    href={
                        explorerURL || "https://goerli.etherscan.io/tx/0xf32673f7e74f0ed5c444f3bac74e268073679c8233e4ef276d4e9b0aa7ea8240"
                    }
                    className="flex flex-col items-center justify-evenly w-[290px] h-12 button-dark bg-textBlue-300 border-[1px] border-textBlue-300 rounded-lg shadow-sm cursor-pointer">
                    <span className="text-white font-medium">Block Explorer</span>
                </Link>
            </div>
        </div>
    )
}

export default TransactionStatusModal
