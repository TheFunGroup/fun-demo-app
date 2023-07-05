import { OAuthExtension } from "@magic-ext/oauth"
import { ethers } from "ethers"
import { Magic } from "magic-sdk"
import Image from "next/image"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { socials, socialsIndex } from "../../utils/socials"

import Spinner from "../misc/Spinner"

export default function OAuthButton({ activateConnector, setSelectedConnectors, authType, connector, selectedConnectors }) {
    const [disabled, setDisabled] = useState(false)
    const [loading, setLoading] = useState(-1)
    const hooks = connector[1]
    const { useIsActive, useAccounts } = hooks
    const isActive = useIsActive()
    const accounts = useAccounts()
    const [selectedAuths, setSelectedAuths] = useState([])
    return (
        <div className="button bg-[#FFFFFF] mb-3 w-full rounded-lg border-[#D0D5DD]">
            {socialsIndex.slice(3).map((social, idx) => {
                return (
                    <button
                        className="button mb-3 w-full rounded-lg border-[#D0D5DD] border-[1px] bg-white flex justify-center cursor-pointer py-[10px] px-4"
                        disabled={disabled}
                        onClick={async () => {
                            console.log(connector)
                            setLoading(idx)

                            await activateConnector(connector[0], social.name.toLowerCase())
                            console.log(isActive, selectedConnectors)
                            console.log(connector[2].getState())
                            console.log("ACCOUNTNS", accounts)
                            console.log(connector[0].name)
                            if (selectedAuths.indexOf(idx) !== -1) {
                                setSelectedAuths([])
                            } else {
                                setSelectedAuths([idx])
                            }
                            const newArray = [...selectedConnectors]
                            const foundIndex = selectedConnectors.indexOf(3)
                            if (selectedAuths.length) {
                                if (foundIndex !== -1) {
                                    newArray.splice(foundIndex, 1)
                                }
                            } else {
                                if (foundIndex === -1) {
                                    newArray.push(3)
                                }
                            }
                            setSelectedConnectors(newArray)
                            setLoading(-1)
                        }}
                        key={3+idx}>
                        {loading == idx ? <Spinner /> : <Image src={social.icon} width="22" height="22" alt="" />}
                        <div className="ml-3 font-medium text-[#344054]">{`${authType == "signup" ? "Sign up" : "Login"} with ${
                            social.name
                        }`}</div>
                        {selectedAuths.indexOf(idx) !== -1 && <Image src="/checkbox.svg" width="22" height="22" alt="" />}
                    </button>
                )
            })}
        </div>
    )
}
