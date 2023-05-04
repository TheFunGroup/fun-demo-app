import { useEffect, useState, useRef } from "react";
import Image from 'next/image';
import { ethers } from "ethers";
import Spinner from "../misc/Spinner";
import { useFun, network } from "../../contexts/funContext";
import { MultiAuthEoa } from "fun-wallet/auth";
import { useFaucet, createFunWallet, isAuthIdUsed } from "../../scripts/wallet";
import { useAccount } from 'wagmi'
import socials from "../../utils/socials";
import { getAddress } from "../../scripts/wallet";

export default function LinkAccounts(props) {

  const {
    connect, connectors, setWallet, linked,
    setLinked, provider, setProvider, magic,
    connecting, setConnecting, signer
  } = props;
  const { setLoading, setEOA } = useFun()
  const { connector } = useAccount()
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    const linkConnector = async () => {
      setConnecting(connector.name)
      setLoading(true)
      const chainId = await connector.getChainId();
      if (chainId !== 5) await connector.switchChain(5)
      const signer = await connector.getSigner();
      const provider = await connector.getProvider();
      // const provider = signer.provider;
      if (!linked[connector.name]) {
        const eoaAddr = await connector.getAccount()
        const addr = await getAddress(eoaAddr, network || 5);
        const authIdUsed = await isAuthIdUsed(addr)
        console.log("LinkWallet authIdUsed: ", authIdUsed)
        if (!authIdUsed) {
          linked[connector.name] = [eoaAddr, eoaAddr]
        } else {
          alert("This account is already connected to a FunWallet")
        }
        setLinked(linked)
      }
      setProvider(provider)
      setConnecting("")
      setLoading(false)
    }
    if (connector && !linked[connector.name]) {
      linkConnector();
    } else if (connecting == connector?.name) {
      setConnecting("")
    }
  }, [connector])

  async function linkMagic(oauthProvider) {
    try {
      setConnecting(oauthProvider);
      setLoading(true)
      localStorage.setItem("magic-connecting", oauthProvider)
      localStorage.setItem("magic-linking", oauthProvider)
      localStorage.setItem("linked", JSON.stringify(linked))
      await magic.oauth.loginWithRedirect({
        provider: oauthProvider,
        redirectURI: new URL('/connect', window.location.origin).href
      });
    } catch (err) {
      console.log("connect wallet connect error", err)
    }
  }

  async function createWallet() {
    if (creating) return;
    setLoading(true);
    setCreating(true)
    try {
      let ids = [];
      const methods = Object.keys(linked);
      for (let i = 0; i < methods.length; i++) {
        ids.push(linked[methods[i]])
      }
      const auth = new MultiAuthEoa({ provider, authIds: ids })
      const wallet = await createFunWallet(auth)
      setEOA(auth)
      const addr = await wallet.getAddress()
      let balance = await provider.getBalance(addr);
      balance = ethers.utils.formatEther(balance);
      if (balance == 0) {
        await useFaucet(addr, 5);
      }
      setWallet(wallet);
    } catch (e) {
      console.log(e)
    }
    localStorage.removeItem("linked")
    setLoading(false);
    setCreating(false)
  }

  return (
    <div className={`w-[360px] modal flex flex-col items-center text-center -mt-[156px] mb-12`}>
      <Image src="/fun.svg" width="52" height="42" alt="" />
      <div className="font-semibold text-2xl mt-6 text-[#101828]">Unlock more options for accessing your FunWallet</div>
      <div className="text-sm text-[#667085] mt-1">Add sign-in methods. Please note you can only add them during creation.</div>

      {(connectors.map((connector, idx) => {
        let name = connector.name;
        if (name == "WalletConnectLegacy") name = "WalletConnect"
        return (
          <button className="button mt-3 w-full rounded-lg border-[#D0D5DD] border-[1px] bg-white flex justify-between cursor-pointer py-[10px] px-4"
            disabled={!connector.ready}
            onClick={() => {
              if (!connecting) connect({ connector })
            }}
            key={idx}
          >
            <div className="flex items-center">
              {connecting == connector.name ? (
                <Spinner />
              ) : (
                <Image src="/wallet.svg" width="22" height="22" alt="" />
              )}
              <div className="ml-3 font-medium text-[#344054]">{name}</div>
            </div>
            {linked[connector.name] && (
              <Image src="/checkbox.svg" width="22" height="22" alt="" />
            )}
          </button>
        )
      }))}

      {Object.keys(socials).map((key) => {
        const social = socials[key]
        return (
          <button className="button mt-3 w-full rounded-lg border-[#D0D5DD] border-[1px] bg-white flex justify-between cursor-pointer py-[10px] px-4"
            onClick={() => {
              if (!connecting) linkMagic(key)
            }}
            key={key}
          >
            <div className="flex items-center">
              {connecting == key ? (
                <Spinner />
              ) : (
                <Image src={social.icon} width="22" height="22" alt="" />
              )}
              <div className="ml-3 font-medium text-[#344054]">{`Link to ${social.name}`}</div>
            </div>
            {linked[key] && (
              <Image src="/checkbox.svg" width="22" height="22" alt="" />
            )}
          </button>
        )
      })}

      <div onClick={createWallet} className={`
        flex justify-center items-center text-center cursor-pointer
        mt-6 button-dark font-medium w-full p-4
        ${creating && "pointer-events-none"}
      `}>
        {creating ? (
          <Spinner />
        ) : (
          <div>Done</div>
        )}
      </div>

    </div>
  )
}