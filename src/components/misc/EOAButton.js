import { OAuthExtension } from "@magic-ext/oauth"
import { ethers } from "ethers"
import { Magic } from "magic-sdk"
import Image from "next/image"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"

import Spinner from "../misc/Spinner"

export default function EOAButton({ social, index, activateConnector, setSelectedConnectors, authType, connector, selectedConnectors }) {
    const [disabled, setDisabled] = useState(false)
    const [loading, setLoading] = useState(false)
    const hooks = connector[1]
    const { useIsActive, useAccounts} = hooks
    const isActive = useIsActive()
    return (
        <button
            className="button mb-3 w-full rounded-lg border-[#D0D5DD] border-[1px] bg-white flex justify-center cursor-pointer py-[10px] px-4"
            disabled={disabled}
            onClick={async () => {
                console.log(connector)
                setLoading(true)
                if (!isActive) {
                    await activateConnector(connector[0], social.name.toLowerCase())
                }
                const foundIndex = selectedConnectors.indexOf(index)
                const newArray = [...selectedConnectors]
                if (foundIndex !== -1) {
                    // foundIndex exists in the array, so remove it
                    newArray.splice(foundIndex, 1)
                } else {
                    if (!connector[2].getState().accounts) return
                    // Index doesn't exist, so add it
                    newArray.push(index)
                }
                
                setSelectedConnectors(newArray)
                setLoading(false)
            }}
            key={index}>
            {loading ? <Spinner /> : <Image src={social.icon} width="22" height="22" alt="" />}
            <div className="ml-3 font-medium text-[#344054]">{`${authType == "signup" ? "Sign up" : "Login"} with ${social.name}`}</div>
            {selectedConnectors.indexOf(index) !== -1 && <Image src="/checkbox.svg" width="22" height="22" alt="" />}
        </button>
    )
}
