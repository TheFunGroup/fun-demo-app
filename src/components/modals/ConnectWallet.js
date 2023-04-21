import { useEffect, useState, useRef } from "react";
import Image from 'next/image';
import { ethers } from "ethers";
import { createFunWallet, useFaucet, isContract } from "../../scripts/wallet";
import Spinner from "../misc/Spinner";
import { useFun } from "../../contexts/funContext";
import { Web3AuthEoa, Eoa } from "/Users/jamesrezendes/Code/fun-wallet-sdk/auth";
import { useAccount, useProvider, useConnect, useSigner } from 'wagmi'
import LinkAccounts from "./LinkAccounts";
import { useRouter } from 'next/router';
import { Magic } from 'magic-sdk';
import { OAuthExtension } from '@magic-ext/oauth';

const socials = {
  "google": {
    icon: "/google.svg",
    name: "Google"
  },
  "twitter": {
    icon: "/twitter.svg",
    name: "Twitter",
  },
  "facebook": {
    icon: "/facebook.svg",
    name: "Facebook"
  },
  "apple": {
    icon: "/apple.svg",
    name: "Apple"
  },
  "discord": {
    icon: "/discord.svg",
    name: "Discord"
  }
}

export default function ConnectWallet(props) {
  const { connect, connectors } = useConnect()
  const { connector } = useAccount()
  const { data: signer } = useSigner()
  const wagmiProvider = useProvider()
  const { setWallet, network, setNetwork, setEOA, setLoading, setConnectMethod } = useFun()
  const [connecting, setConnecting] = useState();
  const [showEOA, setShowEOA] = useState(false);
  const [showLinkMore, setShowLinkMore] = useState(false);
  const [linked, setLinked] = useState({});
  const [linkingWallet, setLinkingWallet] = useState();
  const [provider, setProvider] = useState();
  const router = useRouter()

  const [magic, setMagic] = useState()
  const [creating, setCreating] = useState()

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
      if(isLinking){
        // setConnecting(isLinking)
        const Linked = JSON.parse(localStorage.getItem("linked"));
        console.log({...linked, ...Linked});
        setLinked({...linked, ...Linked});
        setShowLinkMore(true);
      }

    }
    initMagicAuth()
  }, [])


  useEffect(() => {
    const connectFunWallet = async () => {
      let provider = await connector?.getProvider()
      if (signer && provider) {
        const chainId = await connector.getChainId();
        if(chainId !== 5) await connector.switchChain(5)
        setNetwork(5)
        provider = await connector?.getProvider();
        const auth = new Eoa({ signer: signer, provider: provider })
        setConnecting(connector.name)
        setLoading(true)
        setEOA(auth);
        setConnectMethod("wagmi");
        const uniqueId = await auth.getUniqueId()
        const FunWallet = await createFunWallet(uniqueId)
        const addr = await FunWallet.getAddress()
        FunWallet.address = addr
        console.log(FunWallet);
        console.log(auth);
        const deployed = await isContract(addr, wagmiProvider);
        console.log("deployed", deployed)
        if(deployed){
          FunWallet.deployed = true
        } else {
          FunWallet.deployed = false;
          setLinkingWallet(FunWallet)
          setProvider(provider)
          const eoaAddr = await connector.getAccount()
          if(!linked[connector.name]){
            linked[connector.name] = `${connector.name}###${eoaAddr}`;
            setLinked(linked)
          } 
          setShowLinkMore(true)
          setLoading(false)
          return;
        }
        try {
          let balance = await wagmiProvider.getBalance(addr);
          balance = ethers.utils.formatEther(balance);
          if (balance == 0) {
            await useFaucet(addr, 5);
          }
        } catch(e){
          console.log(e)
        }
        setProvider(provider)
        setWallet(FunWallet);
        setConnecting("")
        setLoading(false)
      }
    }
    if(!showLinkMore){
      connectFunWallet()
    }
  }, [signer, wagmiProvider])

  useEffect(() => {
    if(router.query.provider) finishSocialLogin();
  }, [router.query]);

  const finishSocialLogin = async () => {
    const oauthProvider = localStorage.getItem("magic-connecting");
    console.log("Connecting to " + oauthProvider)
    setConnecting(oauthProvider);
    setLoading(true)
    let result = await magic.oauth.getRedirectResult();
    let id = result.oauth.userInfo.email;
    if(result.oauth.provider == "twitter"){
      id = result.oauth.userInfo.preferredUsername
    }
    localStorage.removeItem("magic-connecting");
    const isLinking = localStorage.getItem("magic-linking");
    const provider = new ethers.providers.Web3Provider(magic.rpcProvider);
    if(isLinking && !linked[result.oauth.provider]){
      linked[result.oauth.provider] = `${result.oauth.provider}###${id}`;
      setLinked(linked)
      setConnecting(false)
      setLoading(false)
      setProvider(provider);
      localStorage.removeItem("magic-linking")
      return;
    } 
    const auth = new Web3AuthEoa({ provider })
    const FunWallet = await createFunWallet(auth, provider)
    const addr = await FunWallet.getAddress();
    FunWallet.address = addr;
    setEOA(auth);
    const deployed = await isContract(addr, provider);
    if(deployed){
      FunWallet.deployed = true
    } else {
      FunWallet.deployed = false;
      setLinkingWallet(FunWallet)
      setProvider(provider)
      if(!linked[result.oauth.provider]){
        linked[result.oauth.provider] = `${result.oauth.provider}###${id}`;
        setLinked(linked)
      } 
      setShowLinkMore(true)
      setLoading(false)
      setConnecting("")
      return;
    }
    try {
      const code = await provider.getCode(addr);
    } catch (e) {
      FunWallet.deployed = false
    }
    let balance = await provider.getBalance(addr);
    balance = ethers.utils.formatEther(balance);
    if (balance == 0) {
      await useFaucet(addr);
    }
    setNetwork(network)
    setWallet(FunWallet);
    setConnecting(false)
    setLoading(false)

    // await createWallet(provider, "twitter###" + result.oauth.userInfo.preferredUsername)
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

  if(showLinkMore){
    return (
      <LinkAccounts 
        connect={connect} connectors={connectors} setWallet={setWallet} socials={socials} magic={magic}
        linked={linked} setLinked={setLinked} linkingWallet={linkingWallet} provider={provider} 
        connecting={connecting} setConnecting={setConnecting}
      />
    )
  } else {
    return (
      <div className={`w-[360px] modal flex flex-col items-center text-center -mt-[64px]`} >
        <Image src="/fun.svg" width="52" height="42" alt="" />
        <div className="font-semibold text-2xl mt-6 text-[#101828]">Connect to FunWallet</div>
        <div className="text-sm text-[#667085] mt-1">Explore what you can do with a FunWallet</div>
  
        {!showEOA && (
          <div
            className="button mt-3 w-full rounded-lg border-[#D0D5DD] border-[1px] bg-[rgb(64, 153, 255)] flex justify-center cursor-pointer py-[10px] px-4"
            onClick={() => setShowEOA(true)}
          >
            <Image src="/wallet.svg" width="22" height="22" alt="" />
            <div className="ml-3 font-medium text-[#344054]">Connect with EOA</div>
          </div>
        )}
  
        {(showEOA && connectors.map((connector, idx) => {
          let name = connector.name;
          if(name == "WalletConnectLegacy") name = "WalletConnect"
          return (
            <button className="button mt-3 w-full rounded-lg border-[#D0D5DD] border-[1px] bg-white flex justify-center cursor-pointer py-[10px] px-4"
              disabled={!connector.ready}
              onClick={() => {
                connect({connector})
              }}
              key={idx}
            >
               {connecting == connector.name ? (
                 <Spinner />
               ) : (
                 <Image src="/wallet.svg" width="22" height="22" alt="" />
               )}
             <div className="ml-3 font-medium text-[#344054]">{`Connect with ${name}`}</div>
           </button>
          )
        }))}

        {Object.keys(socials).map((key) => {
          const social = socials[key]
          return (
            <div
              className="button mt-3 w-full rounded-lg border-[#D0D5DD] border-[1px] bg-[rgb(64, 153, 255)] flex justify-center cursor-pointer py-[10px] px-4"
              onClick={() => connectMagic(key)}
              key={key}
            >
              {connecting == key ? (
                <Spinner />
              ) : (
                <Image src={social.icon} width="22" height="22" alt="" />
              )}
              <div className="ml-3 font-medium text-[#344054]">{`Connect with ${social.name}`}</div>
            </div>
          )
        })}

      </div>
    )
  }
}