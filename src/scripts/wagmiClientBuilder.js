import { configureChains, createClient } from 'wagmi'
import { goerli } from 'wagmi/chains'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { WalletConnectLegacyConnector } from 'wagmi/connectors/walletConnectLegacy'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'

export default function wagmiClientBuilder() {
    const { chains, provider, webSocketProvider } = configureChains(
        [goerli],
        [
          jsonRpcProvider({
            rpc: (chain) => {
              const rpcUrl = "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
              return {
                http: rpcUrl,
              }
            },
          }),
        ],
    )

    const wagmiClient = createClient({
        autoConnect: true,
        connectors:[
          new MetaMaskConnector({
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