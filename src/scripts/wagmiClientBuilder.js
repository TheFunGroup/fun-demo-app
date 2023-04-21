import { configureChains, createClient } from 'wagmi'
import { mainnet, goerli, polygon, bsc} from 'wagmi/chains'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { WalletConnectLegacyConnector } from 'wagmi/connectors/walletConnectLegacy'
import { MagicAuthConnector } from '@everipedia/wagmi-magic-connector';

import { publicProvider } from 'wagmi/providers/public';

export default function wagmiClientBuilder() {

    const { chains, provider, webSocketProvider } = configureChains(
        [mainnet, goerli, polygon, bsc],
        [
          publicProvider()
        ],
    )

    const wagmiClient = createClient({
        autoConnect: true,
        connectors:[
          new InjectedConnector({
            chains,
            options: {
              shimDisconnect: true,
            }
          }),
          new CoinbaseWalletConnector({
            chains,
            options: {
              appName: 'wagmi',
            },
          }),
          new WalletConnectLegacyConnector({
            chains,
            options: {
              qrcode: true,
              name: 'WalletConnect',
            }
          }),
          new MagicAuthConnector({
            chains,
            options: {
              apiKey: "pk_live_846F1095F0E1303C",
              oauthOptions: {
                providers: ['facebook', 'google', 'twitter'],
                // callbackUrl: 'https://your-callback-url.com', //optional
              }
            },
          })
        ],
        provider,
        webSocketProvider
    })

    return wagmiClient
}