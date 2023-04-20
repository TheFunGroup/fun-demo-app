import { useEffect, useState, useRef } from "react";
import Image from 'next/image';
import { ethers } from "ethers";
import { createFunWallet } from "../../scripts/wallet";
import Spinner from "../misc/Spinner";
import { useFun } from "../../contexts/funContext";
import { Eoa, WalletConnectEoa } from "/Users/chaz/workspace/fun-wallet/fun-wallet-sdk/auth"
import { Web3AuthEoa } from "/Users/chaz/workspace/fun-wallet/fun-wallet-sdk/auth/Web3AuthEoa"
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { useAccount, useProvider, useConnect, useSigner } from 'wagmi'

import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, WALLET_ADAPTERS } from "@web3auth/base";
import { Magic } from 'magic-sdk';
import { OAuthExtension } from '@magic-ext/oauth';
import { useRouter } from 'next/router';

export default function ConnectWallet(props) {
  const network = 5
  const { connect, connectors } = useConnect()
  const { connector } = useAccount()
  const { data: signer } = useSigner()
  const wagmiProvider = useProvider()
  const router = useRouter()

  const [web3auth, setWeb3auth] = useState()
  const [magic, setMagic] = useState()
  const [provider, setProvider] = useState()
  const { setWallet, setNetwork, setEOA, setLoading } = useFun()
  const [creating, setCreating] = useState()
  const [wConnecting, setWConnecting] = useState()

  useEffect(() => {
    const initMagicAuth = async () => {
      const magic = new Magic('pk_live_846F1095F0E1303C', {
        network: {
          chainId: 5,
          rpcUrl: "https://rpc.ankr.com/eth_goerli"
        },
        extensions: [new OAuthExtension()],
      })
  
      magic.preload()

      setMagic(magic)
    }
    initMagicAuth()
  }, [])

  useEffect(() => {
    const init = async () => {
      try {
        const web3auth = new Web3Auth({
          clientId: "BIzbdbt2x0JZ5kwsduP8Lrbz24lBswyzNRVVIMY6gsFkYnVbQWUsNaOKL6GuZ86wy7exdEWz7DMj89nHWhFS9TU", // Get your Client ID from Web3Auth Dashboard
          web3AuthNetwork: "testnet",
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: "0x5",
            rpcTarget: "https://rpc.ankr.com/eth_goerli	", // This is the mainnet RPC we have added, please pass on your own endpoint while creating an app
          },
        });

        setWeb3auth(web3auth);

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

        if (web3auth.provider) {
          setProvider(web3auth.provider);
        }
      } catch (err) {
        console.log("Connect Wallet Init error", err)
      }
    }

    init()
  }, [])

  useEffect(() => {
    const connectFunWallet = async () => {
      const provider = await connector?.getProvider()
      if (signer && provider) {
        const auth = new Eoa({ signer: signer, provider: provider })
        setCreating(true)
        setLoading(true)
        const FunWallet = await createFunWallet(auth, await auth.getUniqueId(), provider)
        const addr = await FunWallet.getAddress()
        FunWallet.address = addr

        try {
          const code = await wagmiProvider.getCode(addr);
          FunWallet.deployed = true
        } catch (e) {
          FunWallet.deployed = false
        }
        let balance = await wagmiProvider.getBalance(addr);
        balance = ethers.utils.formatEther(balance);
        if (balance == 0) {
          await useFaucet(addr);
        }

        setEOA(auth);
        setNetwork(network)
        setWallet(FunWallet);
        setCreating(false)
        setLoading(false)
      }
    }

    connectFunWallet()
  }, [signer, wagmiProvider])

  // useEffect(() => {
  //   console.log(props)
  //   let provider = new URLSearchParams(props.location.search).get('provider');
  //   provider ? finishSocialLogin() : finishEmailRedirectLogin();
  // }, []);

  useEffect(() => {
    const finishLogin = async () => {
      console.log(router.query)
      router.query.provider ? await finishSocialLogin() : finishEmailRedirectLogin();
    }
    finishLogin()
  }, [router.query]);

  async function createWallet(provider, uniqueID) {
       if (provider) {
        setWConnecting(true)
        setLoading(true)
        const auth = new Web3AuthEoa({ provider })
        const FunWallet = await createFunWallet(auth, 5, provider)
        const addr = await FunWallet.getAddress();
        FunWallet.address = addr;
        try {
          const code = await provider.getCode(addr);
          FunWallet.deployed = true
        } catch (e) {
          FunWallet.deployed = false
        }
        let balance = await provider.getBalance(addr);
        balance = ethers.utils.formatEther(balance);
        if (balance == 0) {
          await useFaucet(addr);
        }
        setEOA(auth);
        setNetwork(network)
        setWallet(FunWallet);
        setWConnecting(false)
        setLoading(false)
       }
  }

  const finishSocialLogin = async () => {
    let result = await magic.oauth.getRedirectResult();
    const provider = new ethers.providers.Web3Provider(magic.rpcProvider);
    await createWallet(provider, "twitter###" + result.oauth.userInfo.preferredUsername)
  };

  const finishEmailRedirectLogin = () => {
    if (router.query.magic_credential)
      magic.auth.loginWithCredential().then((didToken) => authenticateWithServer(didToken));
  };

  async function connectMagic(oauthProvider) {
    try {
      setCreating(true)
      setLoading(true)

      await magic.oauth.loginWithRedirect({
        provider: oauthProvider,
        redirectURI: new URL('/connect', window.location.origin).href
      });
    } catch (err) {
      console.log("connect wallet connect error", err)
    }
  }

  async function connectWeb3Auth() {
    try {
      setCreating(true)
      setLoading(true)
      const web3authProvider = await web3auth.connect()
      const network = 5
      const provider = new ethers.providers.Web3Provider(web3authProvider)
      if (provider) {
        const userInfo = await web3auth.getUserInfo()
        console.log("userInfo", userInfo)
        const idToken = await web3auth.authenticateUser()
        console.log("idToken", idToken)
        let uniqueID
        if (userInfo.email) {
          uniqueID = userInfo.typeOfLogin + "###" + userInfo.email
        } else {
          uniqueID = userInfo.typeOfLogin + "###" + userInfo.name
        }
        const auth = new Web3AuthEoa({ provider, uniqueID })
        const FunWallet = await createFunWallet(auth, 5, provider)
        const addr = await FunWallet.getAddress();
        FunWallet.address = addr;
        try {
          const code = await provider.getCode(addr);
          FunWallet.deployed = true
        } catch (e) {
          FunWallet.deployed = false
        }
        let balance = await provider.getBalance(addr);
        balance = ethers.utils.formatEther(balance);
        if (balance == 0) {
          await useFaucet(addr);
        }
        setEOA(auth);
        setNetwork(network)
        setWallet(FunWallet);
        setWConnecting(false)
        setLoading(false)
      }

    } catch (err) {
      console.log("connect wallet connect error", err)
    }
  }

  async function useFaucet(addr) {
    try {
      await fetch(`http://18.237.113.42:8001/get-faucet?token=eth&testnet=goerli&addr=${addr}`)
      await fetch(`http://18.237.113.42:8001/get-faucet?token=usdc&testnet=goerli&addr=${addr}`)
      await fetch(`http://18.237.113.42:8001/get-faucet?token=dai&testnet=goerli&addr=${addr}`)
      await fetch(`http://18.237.113.42:8001/get-faucet?token=usdt&testnet=goerli&addr=${addr}`)
      setTimeout(() => {
        return
      }, 1500)
    } catch (e) {

    }
  }

  return (
    <div className={`w-[360px] modal flex flex-col items-center text-center -mt-[64px]`} >
      <Image src="/fun.svg" width="52" height="42" alt="" />
      <div className="font-semibold text-2xl mt-6 text-[#101828]">Let the Fun begin</div>
      <div className="text-sm text-[#667085] mt-1">Unlock the power of Fun Wallets.</div>

      {connectors.map((connector) => (
         <button className="button mt-3 w-full rounded-lg border-[#D0D5DD] border-[1px] bg-white flex justify-center cursor-pointer py-[10px] px-4"
           disabled={!connector.ready}
           onClick={() => connect( {connector} )} >
             {creating ? (
               <Spinner />
             ) : (
               <Image src="/wallet.svg" width="22" height="22" alt="" />
             )}
           <div className="ml-3 font-medium text-[#344054]">{connector.name}</div>
         </button>
      ))}

      <div
        className="button mt-3 w-full rounded-lg border-[#D0D5DD] border-[1px] bg-[rgb(64, 153, 255)] flex justify-center cursor-pointer py-[10px] px-4"
        onClick={connectWeb3Auth}
      >
        {wConnecting ? (
          <Spinner />
        ) : (
          <Image src="/wallet.svg" width="22" height="22" alt="" />
        )}
        <div className="ml-3 font-medium text-[#344054]">Connect Web3Auth</div>
      </div>

      <div
        className="button mt-3 w-full rounded-lg border-[#D0D5DD] border-[1px] bg-[rgb(64, 153, 255)] flex justify-center cursor-pointer py-[10px] px-4"
        onClick={() => connectMagic("google")}
      >
        {wConnecting ? (
          <Spinner />
        ) : (
          <Image src="/wallet.svg" width="22" height="22" alt="" />
        )}
        <div className="ml-3 font-medium text-[#344054]">Connect Magic Google</div>
      </div>

      <div
        className="button mt-3 w-full rounded-lg border-[#D0D5DD] border-[1px] bg-[rgb(64, 153, 255)] flex justify-center cursor-pointer py-[10px] px-4"
        onClick={() => connectMagic("twitter")}
      >
        {wConnecting ? (
          <Spinner />
        ) : (
          <Image src="/wallet.svg" width="22" height="22" alt="" />
        )}
        <div className="ml-3 font-medium text-[#344054]">Connect Magic Twitter</div>
      </div>

    </div>
  )
}

export async function getStaticProps() {
  return {
    props: {
      API_KEY: process.env.API_KEY
    }
  }
}