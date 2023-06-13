"use client"
import { configureChains, createConfig } from "wagmi"
import { mainnet, goerli, polygon, bsc } from "wagmi/chains"
import { InjectedConnector } from "wagmi/connectors/injected"
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet"
// import { WalletConnectConnector } from "wagmi/connectors/walletConnect"
// import { WalletConnectLegacyConnector } from "wagmi/connectors/walletConnectLegacy"
import { publicProvider } from "wagmi/providers/public"

export default function wagmiClientBuilder() {
    const { chains, publicClient, webSocketPublicClient } = configureChains([goerli, polygon, bsc], [publicProvider()])

    const wagmiClient = createConfig({
        autoConnect: true,
        connectors: [
            new InjectedConnector({
                chains,
                options: {
                    shimDisconnect: true
                }
            }),
            new CoinbaseWalletConnector({
                chains,
                options: {
                    appName: "wagmi"
                }
            })
            // new WalletConnectLegacyConnector({
            //     chains,
            //     options: {
            //         qrcode: true,
            //         name: "WalletConnect"
            //     }
            // })
        ],
        publicClient,
        webSocketPublicClient
    })

    return wagmiClient
}
