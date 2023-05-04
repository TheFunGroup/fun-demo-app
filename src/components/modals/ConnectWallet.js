import { useEffect, useState } from "react";
import Image from 'next/image';
import { ethers } from "ethers";
import { createFunWallet, useFaucet, isAuthIdUsed } from "../../scripts/wallet";
import Spinner from "../misc/Spinner";
import { useFun } from "../../contexts/funContext";
import { MultiAuthEoa } from "fun-wallet/auth";
import { useAccount, useProvider, useConnect, useSigner } from 'wagmi'
import LinkAccounts from "./LinkAccounts";
import { useRouter } from 'next/router';
import { Magic } from 'magic-sdk';
import { OAuthExtension } from '@magic-ext/oauth';
import socials from "../../utils/socials";

export default function ConnectWallet(props) {
  const { connect, connectors } = useConnect()
  const { connector } = useAccount()
  const { data: signer } = useSigner()
  const wagmiProvider = useProvider()
  const { setWallet, setNetwork, setEOA, setLoading } = useFun()
  const [connecting, setConnecting] = useState();
  const [showEOA, setShowEOA] = useState(false);
  const [showLinkMore, setShowLinkMore] = useState(false);
  const [linked, setLinked] = useState({});
  const [linkingWallet] = useState();
  const [provider, setProvider] = useState();
  const router = useRouter()
  const [magic, setMagic] = useState()
  const [authType, setAuthType] = useState("signup")

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

      const isLinking = localStorage.getItem("magic-linking");
      if (isLinking) {
        const Linked = JSON.parse(localStorage.getItem("linked"));
        setLinked({ ...linked, ...Linked });
        setShowLinkMore(true);
      }

    }
    initMagicAuth()
  }, [])


  useEffect(() => {
    async function connectEOA() {
      setConnecting(connector.name)
      setLoading(true)
      let provider = await connector.getProvider({ chainId: 5 })
      if (signer && provider) {
        const chainId = await connector.getChainId();
        if (chainId !== 5) await connector.switchChain(5)
        setNetwork(5)
        const eoaAddr = await signer.getAddress();
        if (!provider.getBalance) provider = (await connector.getSigner()).provider;
        connectFunWallet(connector.name, eoaAddr, provider, eoaAddr);
      }
    }
    if (!showLinkMore && connector) {
      connectEOA()
    }
  }, [signer, wagmiProvider])

  useEffect(() => {
    if (router.query.provider) finishSocialLogin();
  }, [router.query]);

  async function connectFunWallet(connector, authId, provider, publicKey) {
    const authIdUsed = await isAuthIdUsed(authId)
    if (!authIdUsed) {
      if (!linked[connector]) {
        linked[connector] = [authId, publicKey];
        setLinked(linked)
      }
      setProvider(provider)
      setShowLinkMore(true)
      setLoading(false)
      setConnecting("")
      return;
    }
    const auth = new MultiAuthEoa({ provider, authIds: [[authId, publicKey]] })
    const FunWallet = await createFunWallet(auth)
    const addr = await FunWallet.getAddress()
    FunWallet.address = addr
    try {
      let balance = await provider.getBalance(addr);
      balance = ethers.utils.formatEther(balance);
      if (balance == 0) {
        FunWallet.deployed = false;
        await useFaucet(addr, 5);
      } else {
        FunWallet.deployed = true
      }
    } catch (e) {
      console.log(e)
    }
    setProvider(provider)
    setWallet(FunWallet);
    setEOA(auth)
    setConnecting("")
    setLoading(false)
  }

  const finishSocialLogin = async () => {
    const oauthProvider = localStorage.getItem("magic-connecting");
    setConnecting(oauthProvider);
    setLoading(true)
    try {
      let result = await magic.oauth.getRedirectResult();
      let authId = result.oauth.userInfo.email;
      let publicAddress = result.magic.userMetadata.publicAddress
      if (result.oauth.provider == "twitter") {
        authId = result.oauth.userInfo.preferredUsername
      }
      authId = `${result.oauth.provider}###${authId}`;
      localStorage.removeItem("magic-connecting");
      const isLinking = localStorage.getItem("magic-linking");
      const provider = new ethers.providers.Web3Provider(magic.rpcProvider);
      if (isLinking && !linked[result.oauth.provider]) {
        const authIdUsed = await isAuthIdUsed(authId)
        if (!authIdUsed) {
          linked[result.oauth.provider] = [authId, publicAddress]
        } else {
          alert("This account is already connected to a FunWallet")
        }
        setLinked(linked)
        setConnecting(false)
        setLoading(false)
        setProvider(provider)
        localStorage.removeItem("magic-linking")
        return;
      }
      connectFunWallet(result.oauth.provider, authId, provider, publicAddress)
    } catch (e) {
      console.log("finishSocialLogin", e)
      setConnecting("");
      setLoading(false)
      localStorage.removeItem("magic-connecting");
    }
  };

  async function connectMagic(oauthProvider) {
    try {
      setConnecting(oauthProvider);
      setLoading(true)
      localStorage.setItem("magic-connecting", oauthProvider)
      await magic.oauth.loginWithRedirect({
        provider: oauthProvider,
        redirectURI: new URL('/connect', window.location.origin).href
      });
    } catch (err) {
      console.log("connect wallet connect error", err)
    }
  }

  if (showLinkMore) {
    return (
      <LinkAccounts
        connect={connect} connectors={connectors} setWallet={setWallet} magic={magic}
        linked={linked} setLinked={setLinked} linkingWallet={linkingWallet} provider={provider}
        setProvider={setProvider} connecting={connecting} setConnecting={setConnecting} signer={signer}
      />
    )
  } else {
    return (
      <div className={`w-[360px] modal flex flex-col items-center text-center -mt-[64px]`} >
        <Image src="/fun.svg" width="52" height="42" alt="" />
        <div className="font-semibold text-2xl mt-6 text-[#101828]">{`${authType == "signup" ? "Create" : "Login to"} FunWallet`}</div>
        <div className="text-sm text-[#667085] mt-1">Explore what you can do with FunWallet</div>

        <div className="mt-8 flex w-full justify-between">
          {Object.keys(socials).map((key) => {
            const social = socials[key]
            return (
              <div
                className="max-w-[56px] button rounded-lg border-[#D0D5DD] border-[1px] bg-[rgb(64, 153, 255)] flex justify-center items-center cursor-pointer py-[14px] px-4"
                onClick={() => { if (!connecting) connectMagic(key) }}
                key={key}
              >
                {connecting == key ? (
                  <Spinner />
                ) : (
                  <Image src={social.icon} width="22" height="22" alt="" />
                )}
                {/* <div className="ml-3 font-medium text-[#344054]">{`Connect with ${social.name}`}</div> */}
              </div>
            )
          })}
        </div>

        <div className="w-full flex items-center my-6">
          <div className="w-full bg-[#E4E7EC] h-[1px]"></div>
          <div className="text-[#667085] mx-2">OR</div>
          <div className="w-full bg-[#E4E7EC] h-[1px]"></div>
        </div>

        {!showEOA && (
          <div
            className="button w-full rounded-lg border-[#D0D5DD] border-[1px] bg-[rgb(64, 153, 255)] flex justify-center cursor-pointer py-[10px] px-4"
            onClick={() => setShowEOA(true)}
          >
            <Image src="/wallet.svg" width="22" height="22" alt="" />
            <div className="ml-3 font-medium text-[#344054]">{`${authType == "signup" ? "Sign up" : "Login"} with EOA`}</div>
          </div>
        )}

        {(showEOA && connectors.map((connector, idx) => {
          let name = connector.name;
          if (name == "WalletConnectLegacy") name = "WalletConnect"
          return (
            <button className="button mb-3 w-full rounded-lg border-[#D0D5DD] border-[1px] bg-white flex justify-center cursor-pointer py-[10px] px-4"
              disabled={!connector.ready}
              onClick={() => {
                if (!connecting) connect({ connector })
              }}
              key={idx}
            >
              {connecting == connector.name ? (
                <Spinner />
              ) : (
                <Image src="/wallet.svg" width="22" height="22" alt="" />
              )}
              <div className="ml-3 font-medium text-[#344054]">{`${authType == "signup" ? "Sign up" : "Login"} with ${name}`}</div>
            </button>
          )
        }))}

        <div className="flex items-center w-full justify-center cursor-default mt-8 select-none">
          <div className="text-[#667085] mr-1">{authType == "signup" ? "Already have an account?" : "Don't have an account?"}</div>
          <div 
            className="font-medium text-[#2D4EA2] cursor-pointer transition hover:opacity-80"
            onClick={() => {
              if(authType == "signup"){
                setAuthType("login")
              } else {
                setAuthType("signup")
              }
            }}
          >
            {authType == "signup" ? "Login" : "Sign up"}
          </div>
        </div>

      </div>
    )
  }
}