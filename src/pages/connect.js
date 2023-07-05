import { useRouter } from "next/router"
import React, { useEffect } from "react"
import Layout from "../components/layout"
import ConnectWallet from "../components/modals/ConnectWallet"
import { useFunUtils } from "../contexts/funContext"
import { useFun } from "@fun-xyz/react"
export default function Connect() {
    const { supportedChain, FunWallet } = useFun((state) => {
        return {
            supportedChains: state.supportedChains,
            FunWallet: state.FunWallet
        }
    })
    const router = useRouter()

    useEffect(() => {
        if (FunWallet) {
            router.push("/")
        }
    }, [router, FunWallet])

    return <div className="w-full flex flex-col items-center pt-[200px]">{!FunWallet && <ConnectWallet />}</div>
    // const { wallet, network } = useFunUtils()
    // const router = useRouter()

    // useEffect(() => {
    //     if (wallet && network) {
    //         router.push("/")
    //     }
    // }, [network, router, wallet])

    // return <div className="w-full flex flex-col items-center pt-[200px]">{!wallet && <ConnectWallet />}</div>
}

Connect.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>
}
