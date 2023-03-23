import { useEffect, useState, useRef } from "react";
import Image from 'next/image';
import { networks,  connectToNetwork } from "../utils/networks";
import { useOnClickOutside } from "../hooks/useOnClickOutside";

export default function NetworkSelect(props) {
  
  const setNetwork = props.setNetwork;
  const setWallet = props.setWallet;
  const eoa = props.eoa;
  const [current, setCurrent] = useState(networks[ethereum.networkVersion] ? ethereum.networkVersion : 1)
  const [hover, setHover] = useState();
  const [dropdown, setDropdown] = useState();
  const dropdownRef = useRef()
  const networkBtnRef = useRef()

  function connect(id){
    if(!networks[id]) return;
    connectToNetwork(id).then((err) => {
      if(!err) {
        setCurrent(id);
        setNetwork(id);
      } else {
        console.log(err)
      }
    });
  }

  useEffect(() => {
    if(current) setDropdown(false);
    if(ethereum.networkVersion !== current) connect(current)
  }, [current])

  useOnClickOutside(dropdownRef, (e) => {
    if(networkBtnRef?.current?.contains(e.target) || e.target == networkBtnRef?.current) return;
    setDropdown(false)
  })

  return (
    <div>
      {networks[current] && (
        <div className="w-[124px] flex items-center cursor-pointer mr-4" onClick={() => setDropdown(!dropdown)} ref={networkBtnRef}>
          <Image src={networks[current].icon} width="24" height="24"/>
          <div className="text-[#667085] text-sm mx-2">{networks[current].name}</div>
          <Image src="/chevron.svg" width="20" height="20"/>
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
                  ${id == (current) ? "bg-white" : id == hover ? "bg-[#f5f5f5]" : "bg-[#f9f9f9]"}
                `}
                onClick={() => connect(id)}
                onMouseEnter={() => setHover(id)}
                onMouseLeave={() => setHover("")}
              >
                <div className="flex items-center">
                  <Image src={networks[id].icon} width="24" height="24"/>
                  <div className="text-[#101828] ml-2">{networks[id].name}</div>
                </div>
                <div>
                  {id == current && (
                    <Image src="/check.svg" width="20" height="20"/>
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
