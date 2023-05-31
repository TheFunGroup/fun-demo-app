import { useEffect, useState, useRef } from "react";
import Image from 'next/image';
import { networks } from "../../utils/networks";
import { ethers } from "ethers";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";
import { createFunWallet, useFaucet, switchNetwork } from "../../scripts/wallet";
import Spinner from "../misc/Spinner";
import { useFun } from "../../contexts/funContext";
import { useAccount, useSigner } from 'wagmi'
import { Eoa } from "fun-wallet/auth";

export default function NetworkSelect(props) {

  const { network, setNetwork, setWallet, eoa } = useFun();

  const [hover, setHover] = useState();
  const [dropdown, setDropdown] = useState();
  const dropdownRef = useRef()
  const networkBtnRef = useRef()
  const { connector } = useAccount()
  const { data: signer } = useSigner()

  const [connecting, setConnecting] = useState()

  async function connect(chainId) {
    if (!networks[chainId]) return;
    setConnecting(chainId)
    try {
      await switchNetwork(chainId)
    } catch(e){
      console.log(e)
    }
    setNetwork(chainId);
    setConnecting(false)
    setDropdown(false)
  }

  useOnClickOutside(dropdownRef, (e) => {
    if (networkBtnRef?.current?.contains(e.target) || e.target == networkBtnRef?.current) return;
    setDropdown(false)
  })

  return (
    <div className="flex items-center">
      {networks[network] && (
        <div className="flex items-center mr-4 justify-between cursor-pointer"
         onClick={() => setDropdown(!dropdown)} ref={networkBtnRef}
        >
          <div className="flex items-center">
            <Image src={networks[network].icon} width="24" height="24" alt="" />
            <div className="text-[#667085] text-sm mx-2">{networks[network].name}</div>
          </div>
          <Image src="/chevron.svg" width="20" height="20" alt="" style={dropdown && { transform: "rotate(-180deg)" }}
            className="duration-200 ease-linear"
          />
        </div>
      )}
      {dropdown && (
        <div className="dropdown w-[320px] absolute mt-[218px] -ml-[212px]" ref={dropdownRef}>
          {Object.keys(networks).map((id, idx) => {
            return (
              <div
                className={`
                  w-full flex items-center justify-between px-[14px] py-[10px] cursor-pointer
                  ${idx == 0 && "rounded-t-xl"} ${idx == Object.keys(networks).length - 1 && "rounded-b-xl"}
                  ${id == (network) ? "bg-white cursor-default" : id == hover ? "bg-[#f5f5f5]" : "bg-[#f9f9f9]"}
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
                  {id == network && (
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
