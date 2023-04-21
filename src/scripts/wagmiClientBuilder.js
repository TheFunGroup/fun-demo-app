import { configureChains, createClient } from 'wagmi'
import { mainnet, goerli, polygon, bsc} from 'wagmi/chains'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { WalletConnectLegacyConnector } from 'wagmi/connectors/walletConnectLegacy'
import { publicProvider } from 'wagmi/providers/public';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'

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
          })
        ],
        provider,
        webSocketProvider
    })

    return wagmiClient
}