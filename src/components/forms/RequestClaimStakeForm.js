import React, { useRef } from "react"
import Input from "./Input"

export default function StakeForm(props) {
    const swapExchangeRef = useRef()

    const { stakeInput, setStakeInput, balance } = props

    return (
        <div className="w-full">
            <div className="w-full flex items-center justify-between">
                <Input
                    className="w-full"
                    label="Request Quantity to unstake"
                    placeholder="0.00"
                    type="number"
                    width="80%"
                    value={stakeInput}
                    onChange={(e) => {
                        setStakeInput(e.target.value)
                    }}
                    inputRef={swapExchangeRef}
                    sideLabel={"ETH"}
                    // displayMax={true}
                    balance={balance}
                />
            </div>
        </div>
    )
}
