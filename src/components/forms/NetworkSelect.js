import { useState, useRef } from "react"
import Image from "next/image"
import { useOnClickOutside } from "../../hooks/useOnClickOutside"

// specifically for the Bridging page
export const NETWORKS = {
    137: {
        name: "Polygon",
        icon: "/polygon-rounded.svg",
        chainId: 137,
        ticker: "MATIC"
    },
    42161: {
        name: "Arbitrum",
        icon: "/arbitrum.svg",
        chainId: 42161,
        ticker: "ARB"
    }
}

const getHighlightCSS = (sameNetwork, networkLength, index) => {
    if (index === 0) {
        if (!sameNetwork) return "rounded-t-lg"
        return "bg-[#FAFBFF] rounded-t-lg"
    }
    if (index === networkLength - 1) {
        if (!sameNetwork) return "rounded-b-lg"
        return "bg-[#FAFBFF] rounded-b-lg"
    }
}

export default function NetworkSelect(props) {
    const selectBtnRef = useRef()
    const dropdownRef = useRef()
    const [active, setActive] = useState(false)
    const [dropdown, setDropdown] = useState(false)

    const current_network = NETWORKS[props.network] || NETWORKS["ARB"]

    useOnClickOutside(dropdownRef, (e) => {
        if (selectBtnRef?.current?.contains(e.target) || e.target == selectBtnRef?.current) return
        setDropdown(false)
        setActive(false)
    })

    return (
        <div
            className={`relative  ${props.className} `}
            onClick={() => {
                setDropdown(!dropdown)
                setActive(!active)
            }}
            ref={selectBtnRef}>
            <div className="text-[#344054] text-sm font-medium mb-[6px] cursor-pointer">{props.label}</div>
            <div
                className={`${
                    active ? "border-[#2D4EA2] input-shadow" : "border-[#D0D5DD]"
                } border-[1px] w-full flex items-center justify-between px-[14px] py-[10px] cursor-pointer rounded-lg bg-white`}>
                <div className="flex items-center cursor-pointer">
                    <Image src={current_network.icon} width="20" height="20" alt="" />
                    <div className="text-[#101828] px-[14px] font-medium"> {current_network.name}</div>
                </div>

                <Image
                    src="/chevron.svg"
                    width="24"
                    height="24"
                    alt="chevron"
                    style={dropdown && { transform: "rotate(-180deg)" }}
                    className="duration-200 ease-linear"
                />
            </div>
            {dropdown && (
                <div className="absolute mt-2 border-[1px] border-[#D0D5DD] w-full  rounded-lg bg-white " ref={dropdownRef}>
                    {Object.keys(NETWORKS).map((network, key) => {
                        let isCurrent = getHighlightCSS(props.network === network, Object.keys(NETWORKS).length, key) // returns the bg and rounded for selected option
                        return (
                            <div
                                className={`flex items-center justify-between cursor-pointer py-2 px-4 hover:bg-[#e7ebf3] ${isCurrent}`}
                                key={key}
                                onClick={() => {
                                    props.setNetwork(network)
                                    setDropdown(false)
                                    setActive(false)
                                }}>
                                <div className="flex items-center cursor-pointer">
                                    <Image src={NETWORKS[network].icon} width="20" height="20" alt="" />
                                    <div className="text-[#101828] px-[14px]">{NETWORKS[network].name}</div>
                                </div>

                                {props.network == network && <Image src="/check.svg" width="20" height="20" alt="" />}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
