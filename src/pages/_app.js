import "../styles/globals.css"
import { FunProvider } from "../contexts/funContext"
import { WagmiConfig } from "wagmi"
import wagmiClientBuilder from "../scripts/wagmiClientBuilder"
import { useMemo } from "react"

export default function App({ Component, pageProps }) {
    const getLayout = Component.getLayout || ((page) => page)
    const wagmiClient = useMemo(() => wagmiClientBuilder(), [])

    return (
        <div className="w-full h-full">
            {wagmiClient && (
                <WagmiConfig config={wagmiClient}>
                    <FunProvider>{getLayout(<Component {...pageProps} />)}</FunProvider>
                </WagmiConfig>
            )}
        </div>
    )
}
