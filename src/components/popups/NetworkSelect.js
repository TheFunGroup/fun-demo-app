import { useEffect, useState, useRef } from "react";
import Image from 'next/image';
import { networks } from "../../utils/networks";
import { ethers } from "ethers";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";
import { createFunWallet, useFaucet } from "../../scripts/wallet";
import Spinner from "../misc/Spinner";
import { useFun } from "../../contexts/funContext";
import { useAccount, useSigner } from 'wagmi'
import { Eoa } from "fun-wallet/auth";

export default function NetworkSelect(props) {

  const { network, setNetwork, setWallet } = useFun();

  const [current, setCurrent] = useState(5)
  const [hover, setHover] = useState();
  const [dropdown, setDropdown] = useState();
  const dropdownRef = useRef()
  const networkBtnRef = useRef()
  const { connector } = useAccount()
  const { data: signer } = useSigner()

  const [connecting, setConnecting] = useState()

  async function connect(id) {
    if (!networks[id]) return;
    setConnecting(id)
    let provider;
    let auth;
    try {
      const chainId = await connector.getChainId();
      if (chainId !== id) await connector.switchChain(Number(id))
      provider = await connector?.getProvider();
      auth = new Eoa({ signer: signer, provider: provider })
    } catch (e) {
      console.log(e)
    }
    try {
      const FunWallet = await createFunWallet(auth)
      const addr = await FunWallet.getAddress()
      FunWallet.address = addr
      try {
        const code = await provider.getCode(addr);
        FunWallet.deployed = true
      } catch (e) {
        FunWallet.deployed = false
      }
      provider = new ethers.providers.Web3Provider(window.ethereum, "any")
      let balance = await provider.getBalance(addr);
      balance = ethers.utils.formatEther(balance);
      if (balance == 0) {
        await useFaucet(addr, id);
      }
      setCurrent(id);
      setNetwork(id);
      setWallet(FunWallet);
      setConnecting(false)
      setDropdown(false)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    if (current) setDropdown(false);
    if (network !== current) {
      connect(current)
    }
  }, [current])

  useOnClickOutside(dropdownRef, (e) => {
    if (networkBtnRef?.current?.contains(e.target) || e.target == networkBtnRef?.current) return;
    setDropdown(false)
  })

  return (
    <div>
      {networks[current] && (
        <div className="w-[88px] flex items-center mr-2"
        //  onClick={() => setDropdown(!dropdown)} ref={networkBtnRef}
        >
          <Image src={networks[current].icon} width="24" height="24" alt="" />
          <div className="text-[#667085] text-sm mx-2">{networks[current].name}</div>
          {/* <Image src="/chevron.svg" width="20" height="20" alt="" style={dropdown && { transform: "rotate(-180deg)" }}
            className="duration-200 ease-linear"
          /> */}
        </div>
      )}
      {dropdown && (
        <div className="dropdown w-[320px] absolute mt-2 -ml-[196px]" ref={dropdownRef}>
          {Object.keys(networks).map((id, idx) => {
            return (
              <div
                className={`
                  w-full flex items-center justify-between px-[14px] py-[10px] cursor-pointer
                  ${idx == 0 && "rounded-t-xl"} ${idx == Object.keys(networks).length - 1 && "rounded-b-xl"}
                  ${id == (current) ? "bg-white cursor-default" : id == hover ? "bg-[#f5f5f5]" : "bg-[#f9f9f9]"}
                `}
                onClick={() => { connect(id) }}
                onMouseEnter={() => setHover(id)}
                onMouseLeave={() => setHover("")}
                key={idx}
              >
                <div className="flex items-center">
                  <Image src={networks[id].icon} width="24" height="24" alt="" />
                  <div className="text-[#101828] ml-2">{networks[id].name}</div>
                </div>
                <div>
                  {id == current && (
                    <Image src="/check.svg" width="20" height="20" alt="" />
                  )}
                  {id == connecting && (
                    <Spinner width="20px" height="20px" />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
