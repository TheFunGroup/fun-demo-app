import { useState } from "react";
import TokenSelect from "./TokenSelect";
import ReceiverSelect from "./ReceiverSelect";

export default function Input(props) {

  const [active, setActive] = useState(false)

  return (
    <div className={props.className}>
      <div className="text-[#344054] text-sm font-medium mb-[6px]">{props.label}</div>
      <div 
        className={`${active ? "border-[#2D4EA2] input-shadow" : "border-[#D0D5DD]"} border-[1px] w-full flex items-center justify-between px-[14px] py-[10px] rounded-lg bg-white`}
      >
        <div className="flex items-center">
        {(props.displayMax && props.balance) && (<div className="text-sm text-text-100 pr-2 cursor-pointer" onClick={() => {props.onChange({target:{value:props.balance}})}}>MAX</div>)}
        <input 
          className={`border-0 outline-0 text-[#101828] overflow-x-scroll`}
          style={{width: `${props.width || "180px"}`}}
          placeholder={props.placeholder}
          type={props.type}
          value={props.value}
          onChange={(e) => {props.onChange(e)}}
          onFocus={() => {setActive(true)}}
          onBlur={() => {setActive(false)}}
          ref={props.inputRef || null}
        >
        </input>
        </div>
        {props.tokenSelect && (
          <TokenSelect token={props.token} nonToken={props.nonToken} setToken={(value) => {props.setToken(value)}} excludeETH={props.excludeETH}/>
        )}
        {props.receiverSelect && (
          <ReceiverSelect setType={props.setReceiverType}/>
        )}
        {props.sideLabel && (
          <div className="flex flex-col items-end cursor-pointer" >
            <div className="text-[#101828] mr-1">{props.sideLabel}</div>
            {props.balance && (<div className="text-sm text-text-100 pt-1 pr-1">{`Balance: ${props.balance}`}</div>)}
          </div>
        )}
      </div>
    </div>
  )
}
