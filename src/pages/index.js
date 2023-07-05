import Layout from "../components/layout"
import { useFunUtils } from "../contexts/funContext"
import Main from "../components/modals/Main"
import { useFun } from "@fun-xyz/react"
import { useEffect } from "react"
export default function Home() {
    // const { wallet, network } = useFunUtils()
    const { FunWallet } = useFun((state) => {
        return {
            supportedChains: state.supportedChains,
            FunWallet: state.FunWallet
        }
    })
    useEffect(() => {
        (async function () {
            if (FunWallet) {
                const addr = await FunWallet.getAddress()
                FunWallet.address = addr
                console.log(FunWallet)
            }
        })
    }, [])
    return (
        <div className="w-full flex flex-col items-center pt-[200px]">
            {FunWallet && (
                <div className="w-full flex flex-col items-center">
                    <Main />
                </div>
            )}
        </div>
    )
}

Home.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>
}
