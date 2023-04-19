import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { useAccount, useProvider, useConnect, useSigner } from 'wagmi'
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, WALLET_ADAPTERS } from "@web3auth/base";

const chains = {
  "5": {
    id: "0x5",
    rpc: "https://rpc.ankr.com/eth_goerli"
  },
  "1": {
    id: "0x5",
    rpc: "https://rpc.ankr.com/eth"
  },
  "137": {
    id: "0x89",
    rpc: "https://rpc.ankr.com/polygon"
  },
  "56": {
    id: "0x38",
    rpc: "https://rpc.ankr.com/bsc"
  }
}

export default async function web3AuthClient(network){

  try {
    const web3auth = new Web3Auth({
      clientId: "BIzbdbt2x0JZ5kwsduP8Lrbz24lBswyzNRVVIMY6gsFkYnVbQWUsNaOKL6GuZ86wy7exdEWz7DMj89nHWhFS9TU", // Get your Client ID from Web3Auth Dashboard
      web3AuthNetwork: "testnet",
      chainConfig: {
        chainNamespace: CHAIN_NAMESPACES.EIP155,
        chainId: chains[network].id,
        rpcTarget: chains[network].rpc,
      },
    });

    const openloginAdapter = new OpenloginAdapter({
      loginSettings: {
        mfaLevel: "optional",
      },
    });

    web3auth.configureAdapter(openloginAdapter);

    await web3auth.initModal({
      modalConfig: {
        [WALLET_ADAPTERS.OPENLOGIN]: {
          label: "openlogin",
          loginMethods: {
            google: {
            },
            facebook: {
              showOnModal: false,
            },
            twitter: {
            },
            reddit: {
              showOnModal: false,
            },
            discord: {
            },
            twitch: {
              showOnModal: false,
            },
            apple: {
              showOnModal: false,
            },
            line: {
              showOnModal: false,
            },
            github: {
            },
            kakao: {
              showOnModal: false,
            },
            linkedin: {
              showOnModal: false,
            },
            weibo: {
              showOnModal: false,
            },
            wechat: {
              showOnModal: false,
            },
            email_passwordless: {
              showOnModal: true
            },
          },
          // setting it to false will hide all social login methods from modal.
          showOnModal: true,
        },
        [WALLET_ADAPTERS.METAMASK]: {
          showOnModal: false
        }, 
        [WALLET_ADAPTERS.TORUS_EVM]: {
          showOnModal: false
        },
        [WALLET_ADAPTERS.WALLET_CONNECT_V1]: {
          showOnModal: false
        },
        [WALLET_ADAPTERS.WALLET_CONNECT_V2]: {
          showOnModal: false
        }
      },
    });

    return web3auth

  } catch (err) {
    console.log("Connect Wallet Init error", err)
  }

}