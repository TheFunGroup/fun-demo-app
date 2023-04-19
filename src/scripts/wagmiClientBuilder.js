import { configureChains, createClient } from 'wagmi'
import { mainnet, goerli, polygon, bsc} from 'wagmi/chains'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { WalletConnectLegacyConnector } from 'wagmi/connectors/walletConnectLegacy'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { publicProvider } from 'wagmi/providers/public';
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, WALLET_ADAPTERS } from "@web3auth/base";
import { Web3AuthConnector } from "@web3auth/web3auth-wagmi-connector";

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
          new WalletConnectConnector({
            options: {
            projectId: '5a25d59af74387684be4b2fdf1ab0bc3',
            },
          }),
          new WalletConnectLegacyConnector({
            chains,
            options: {
              qrcode: true,
            }
          })
        ],
        provider,
        webSocketProvider
    })

    return wagmiClient
}