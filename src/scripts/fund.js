import { ethers } from "ethers";
import { tokens } from "../utils/tokens";

export const handleFundWallet = async function (addr) {
    try {
        await fetch(`http://18.237.113.42:8001/get-faucet?token=eth&testnet=goerli&addr=${addr}`)
        await fetch(`http://18.237.113.42:8001/get-faucet?token=usdc&testnet=goerli&addr=${addr}`)
        await fetch(`http://18.237.113.42:8001/get-faucet?token=dai&testnet=goerli&addr=${addr}`)
        await fetch(`http://18.237.113.42:8001/get-faucet?token=usdt&testnet=goerli&addr=${addr}`)
        setTimeout(() => {
            return;
        }, 1500)
    } catch(e){
        return e;
    }
}