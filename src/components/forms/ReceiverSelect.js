import { useEffect, useState, useRef } from "react";
import Image from 'next/image';
import { useOnClickOutside } from "../../hooks/useOnClickOutside";

const types = {
  "Address": "EOA Address",
  "Twitter": "Twitter Handle"
}

export default function ReceiverSelect(props) {
  
  const [type, setType] = useState("Address");
  const [hover, setHover] = useState();
  const [dropdown, setDropdown] = useState();
  const dropdownRef = useRef()
  const selectBtnRef = useRef()

  useEffect(() => {
    setDropdown(false);
    props.setType(type);
  }, [type])

  useOnClickOutside(dropdownRef, (e) => {
    if(selectBtnRef?.current?.contains(e.target) || e.target == selectBtnRef?.current) return;
    setDropdown(false)
  })

  return (
    <div className="">
      <div ref={selectBtnRef} className="flex items-center cursor-pointer" onClick={() => setDropdown(!dropdown)}>
        <div className="text-[#101828] mr-1">{type}</div>
        <Image src="/chevron.svg" width="20" height="20" alt="" style={dropdown && {transform: "rotate(-180deg)"}}
          className="duration-200 ease-linear"
        />
      </div>
      {dropdown && (
        <div className="dropdown w-[200px] absolute -ml-[100px] mt-2" ref={dropdownRef}>
          {Object.keys(types)?.map((t, idx) => {
            return (
              <div 
                className={`
                  w-full flex justify-between px-[14px] py-[10px] cursor-pointer
                  ${idx == 0 && "rounded-t-xl"} ${idx == 1 && "rounded-b-xl"}
                  ${t == type ? "bg-[#2D4EA214]" : t == hover ? "bg-[#2D4EA207]" : "bg-white"}
                `}
                onClick={() => {setType(t)}}
                onMouseEnter={() => setHover(t)}
                onMouseLeave={() => setHover("")}
                key={idx}
              >
                <div className="text-[#101828] text-sm">{types[t]}</div>
                <div>
                  {t == type && (
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
