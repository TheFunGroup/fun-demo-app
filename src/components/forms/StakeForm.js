import React, { useRef } from "react"
import Input from "./Input"

export default function StakeForm(props) {
    const swapExchangeRef = useRef()

    const { stakeInput, setStakeInput } = props

    return (
        <div className="w-full">
            <div className="w-full flex items-center justify-between">
                <Input
                    className="w-full"
                    label="Stake Quantity & tokens"
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
                    balance={props.balance}
                />
            </div>
        </div>
    )
}
