import React, { createContext, useState, useContext, useEffect } from "react"
import { useRouter } from "next/router"
import UpdateBanner from "../components/misc/UpdateBanner"
import { useFun } from "@fun-xyz/react"

const FunContext = createContext()
const APP_IS_UPDATING = false
export const FunProvider = ({ children }) => {
    const { supportedChain, FunWallet, Eoa } = useFun((state) => {
        return {
            supportedChains: state.supportedChains,
            FunWallet: state.FunWallet,
            Eoa: state.Eoa
        }
    })
    const router = useRouter()
    const [provider, setProvider] = useState()
    const [eoa, setEOA] = useState()
    // const [wallet, setWallet] = useState()
    const [network, setNetwork] = useState(5)
    const [deployedUrl, setDeployedUrl] = useState()
    const [minted, setMinted] = useState()
    const [loading, setLoading] = useState()
    const [paymentToken, setPaymentToken] = useState("ETH")
    const [paymentAddr, setPaymentAddr] = useState()
    const [paymasterAddress, setPaymasterAddress] = useState()
    const [connectMethod, setConnectMethod] = useState()

    useEffect(() => {
        if (APP_IS_UPDATING) {
            setLoading(false)
            window.APP_IS_UPDATING = APP_IS_UPDATING
        }
        if ((!FunWallet || !network) && router.pathname !== "/connect") {
            router.push("/connect")
        }
    }, [FunWallet, network, router.pathname, APP_IS_UPDATING])

    return (
        <FunContext.Provider
            value={{
                eoa: Eoa,
                // setEOA,
                wallet: FunWallet,
                network,
                setNetwork,
                deployedUrl,
                setDeployedUrl,
                minted,
                setMinted,
                loading,
                setLoading,
                paymentToken,
                setPaymentToken,
                paymentAddr,
                setPaymentAddr,
                paymasterAddress,
                setPaymasterAddress,
                connectMethod,
                setConnectMethod
            }}>
            {APP_IS_UPDATING && <UpdateBanner />}
            {children}
        </FunContext.Provider>
    )
}

export const useFunUtils = () => useContext(FunContext)
