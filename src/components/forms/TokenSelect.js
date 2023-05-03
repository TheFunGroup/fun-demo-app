import { useEffect, useState, useRef } from "react";
import Image from 'next/image';
import { tokens } from "../../utils/tokens";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";
import { useFun } from "../../contexts/funContext";

export default function TokenSelect(props) {
  
  const setToken = props.setToken;
  const token = props.token;
  const nonToken = props.nonToken;
  const [hover, setHover] = useState();
  const [dropdown, setDropdown] = useState();
  const dropdownRef = useRef()
  const selectBtnRef = useRef()

  const { network } = useFun();

  useEffect(() => {
    setDropdown(false);
  }, [token])

  useOnClickOutside(dropdownRef, (e) => {
    if(selectBtnRef?.current?.contains(e.target) || e.target == selectBtnRef?.current) return;
    setDropdown(false)
  })

  return (
    <div className="">
      <div ref={selectBtnRef} className="flex items-center cursor-pointer" onClick={() => setDropdown(!dropdown)}>
        <div className="text-[#101828] mr-1">{token.name}</div>
        <Image src="/chevron.svg" width="20" height="20" alt="" style={dropdown && {transform: "rotate(-180deg)"}}
          className="duration-200 ease-linear"
        />
      </div>
      {dropdown && (
        <div className="dropdown w-[200px] absolute -ml-[132px] mt-2" ref={dropdownRef}>
          {tokens[network]?.map((t, idx) => {
            if(t.name == "ETH" && props.excludeETH) return;
            return (
              <div 
                className={`
                  w-full flex justify-between px-[14px] py-[10px] ${nonToken?.name == t.name ? "cursor-not-allowed" : "cursor-pointer"}
                  ${idx == 0 && "rounded-t-xl"} ${idx == tokens[network].length - 1 && "rounded-b-xl"}
                  ${t.name == (token.name) ? "bg-[#2D4EA214]" : t.name == hover ? "bg-[#2D4EA207]" : "bg-white"}
                `}
                onClick={() => {nonToken?.name !== t.name && setToken(t)}}
                onMouseEnter={() => setHover(t.name)}
                onMouseLeave={() => setHover("")}
                key={idx}
              >
                <div className="text-[#101828] text-sm">{t.name}</div>
                <div>
                  {t.name == token && (
                    <Image src="/check.svg" width="20" height="20" alt=""/>
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
