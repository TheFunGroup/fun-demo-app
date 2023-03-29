import { useEffect, useState, useRef } from "react";
import TokenSelect from "./TokenSelect";

export default function Input(props) {

  const [active, setActive] = useState(false)

  return (
    <div className={props.className}>
      <div className="text-[#344054] text-sm font-medium mb-[6px]">{props.label}</div>
      <div 
        className={`${active ? "border-[#2D4EA2] input-shadow" : "border-[#D0D5DD]"} border-[1px] w-full flex items-center justify-between px-[14px] py-[10px] rounded-lg bg-white`}
      >
        <input 
          className="border-0 outline-0 w-full text-[#101828]" placeholder={props.placeholder} type={props.type} value={props.value}
          onChange={(e) => {props.onChange(e)}}
          onFocus={() => {setActive(true)}}
          onBlur={() => {setActive(false)}}
          ref={props.inputRef || null}
        >
        </input>
        {props.tokenSelect && (
          <TokenSelect token={props.token} setToken={(value) => {props.setToken(value)}}/>
        )}
      </div>
    </div>
  )
}
