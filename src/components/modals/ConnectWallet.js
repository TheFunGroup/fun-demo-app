import { useEffect, useState, useRef } from "react";
import Image from 'next/image';
import { ethers } from "ethers";
import { createFunWallet, useFaucet, isContract } from "../../scripts/wallet";
import Spinner from "../misc/Spinner";
import { useFun } from "../../contexts/funContext";
import { Web3AuthEoa, Eoa } from "/Users/jamesrezendes/Code/fun-wallet-sdk/auth";
import { useAccount, useProvider, useConnect, useSigner } from 'wagmi'
import web3AuthClient from "../../scripts/web3auth";
import LinkAccounts from "./LinkAccounts";

import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, WALLET_ADAPTERS } from "@web3auth/base";
import { useRouter } from 'next/router';

export default function ConnectWallet(props) {
  const { connect, connectors } = useConnect()
  const { connector } = useAccount()
  const { data: signer } = useSigner()
  const wagmiProvider = useProvider()
  const [web3auth, setWeb3auth] = useState()
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
  const [wConnecting, setWConnecting] = useState()

  // useEffect(() => {
  //   const initMagicAuth = async () => {
  //     const magic = new Magic('pk_live_846F1095F0E1303C', {
  //       network: {
  //         chainId: 5,
  //         rpcUrl: "https://rpc.ankr.com/eth_goerli"
  //       },
  //       extensions: [new OAuthExtension()],
  //     })
  
  //     magic.preload()

  //     setMagic(magic)
  //   }
  //   initMagicAuth()
  // }, [])

  useEffect(() => {
    const init = async () => {
      try {
        const web3Auth = await web3AuthClient(network)
        setWeb3auth(web3Auth);
      } catch(e){
        console.log("Connect Wallet Init error", e)
      }
    }

    // init()
  }, [])

  useEffect(() => {
    const connectFunWallet = async () => {
      let provider = await connector?.getProvider()
      if (signer && provider) {
        console.log(connector)
        console.log(signer);
        console.log(provider)
        // const chainId = await connector.getChainId();
        // if(chainId !== 5) await connector.switchChain(5)
        setNetwork(5)
        provider = await connector?.getProvider();
        const auth = new Eoa({ signer: signer, provider: provider })
        setConnecting(connector.name)
        setLoading(true)
        setEOA(auth);
        setConnectMethod("wagmi");
        const FunWallet = await createFunWallet(auth)
        const addr = await FunWallet.getAddress()
        FunWallet.address = addr
        console.log(FunWallet);
        console.log(auth);
        const deployed = await isContract(addr, wagmiProvider);
        console.log("deployed", deployed)
        if(deployed){
          FunWallet.deployed = true
          console.log("DEPLOYED")
        } else {
          // console.log('not deployed')
          // FunWallet.deployed = false;
          // setLinkingWallet(FunWallet)
          // setProvider(provider)
          // const eoaAddr = await connector.getAccount()
          // if(!linked[connector.name]){
          //   linked[connector.name] = `${connector.name}###${eoaAddr}`;
          //   setLinked(linked)
          // } 
          // setShowLinkMore(true)
          // setLoading(false)
          // return;
        }
        try {
          let balance = await wagmiProvider.getBalance(addr);
          balance = ethers.utils.formatEther(balance);
          // if (balance == 0) {
            await useFaucet(addr, 5);
          // }
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

  // useEffect(() => {
  //   console.log(props)
  //   let provider = new URLSearchParams(props.location.search).get('provider');
  //   provider ? finishSocialLogin() : finishEmailRedirectLogin();
  // }, []);

  // useEffect(() => {
  //   if(router.query.provider) finishSocialLogin();
  // }, [router.query]);

  // useEffect(() => {
  //   const finishSocialLogin = async () => {
  //     if (magic) {
  //       console.log("useEffect magic", magic)
  //       const result = await magic.oauth.getRedirectResult();
  //       console.log("magic oauth result", result)
  //       magic.user.isLoggedIn().then((isLoggedIn) => {
  //         console.log("isLoggedIn", isLoggedIn)
  //       });
  //     }
  //   }
  //   finishSocialLogin()
  // }, [magic]);

  const finishSocialLogin = async () => {
    console.log("finishSocialLogin")
    console.log(router.query)
    const result = await magic.oauth.getRedirectResult();
    console.log(result)
    // let result = await magic.oauth.getRedirectResult();
    // console.log("finishSocialLogin result", result)
    // authenticateWithServer(result.magic.idToken);
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

      const result = await magic.oauth.getRedirectResult();
      console.log("magic oauth result", result)
      const provider = new ethers.providers.Web3Provider(magic.rpcProvider);
      console.log(provider)
       if (provider) {
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

  async function connectWeb3Auth() {
    try {
      const web3authProvider = await web3auth.connect()
      setConnecting("web3Auth")
      setLoading(true)
      setNetwork(5)
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
        setEOA(auth);
        setConnectMethod("web3Auth");
        // try {
        //   await provider.getCode(addr);
        //   FunWallet.deployed = true
        // } catch (e) {
        //   FunWallet.deployed = false;
        //   const user = await web3auth.getUserInfo();
        //   const id = `${user.typeOfLogin}###${user.verifierId}`;
        //   if(!linked[user.typeOfLogin]){
        //     linked[user.typeOfLogin] = id;
        //     setLinked(linked)
        //   }
        //   setShowLinkMore(true)
        //   setLoading(false)
        //   setConnecting(false)
        //   setProvider(provider)
        //   setLinkingWallet(FunWallet)
        //   return;
        // }
        try {
          let balance = await provider.getBalance(addr);
          balance = ethers.utils.formatEther(balance);
          if (balance == 0) {
            await useFaucet(addr, 5);
          }
        } catch(e){
          console.log(e)
        }
        setWallet(FunWallet);
        setProvider(provider)
        setLoading(false);
        setConnecting(false)
      }

    } catch (err) {
      console.log("connect wallet connect error", err)
    }
  }

  if(showLinkMore){
    return (
      <LinkAccounts 
        connect={connect} connectors={connectors} web3auth={web3auth} setWallet={setWallet} 
        linked={linked} setLinked={setLinked} linkingWallet={linkingWallet} provider={provider}
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
             <div className="ml-3 font-medium text-[#344054]">{name}</div>
           </button>
          )
        }))}
  
        <div
          className="button mt-3 w-full rounded-lg border-[#D0D5DD] border-[1px] bg-[rgb(64, 153, 255)] flex justify-center cursor-pointer py-[10px] px-4"
          onClick={connectWeb3Auth}
        >
          {connecting == "web3Auth" ? (
            <Spinner />
          ) : (
            <Image src="/web2.svg" width="22" height="22" alt="" />
          )}
          <div className="ml-3 font-medium text-[#344054]">Connect with Web2</div>
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
}}