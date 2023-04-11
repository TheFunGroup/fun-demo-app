import { ethers } from "ethers";
import { tokens } from "../utils/tokens";
const FAUCETURL = "https://vyhjm494l3.execute-api.us-west-2.amazonaws.com/prod/demo-faucet/get-faucet"
export const handleFundWallet = async function (addr) {
    try {
        // await fetch(`http://18.237.113.42:8001/get-faucet?token=eth&testnet=goerli&addr=${addr}`)
        // await fetch(`http://18.237.113.42:8001/get-faucet?token=usdc&testnet=goerli&addr=${addr}`)
        // await fetch(`http://18.237.113.42:8001/get-faucet?token=dai&testnet=goerli&addr=${addr}`)
        // await fetch(`http://18.237.113.42:8001/get-faucet?token=usdt&testnet=goerli&addr=${addr}`)
        await fetch(`${FAUCETURL}?token=eth&testnet=goerli&addr=${addr}`)
        await fetch(`${FAUCETURL}?token=usdc&testnet=goerli&addr=${addr}`)
        await fetch(`${FAUCETURL}?token=dai&testnet=goerli&addr=${addr}`)
        await fetch(`${FAUCETURL}?token=usdt&testnet=goerli&addr=${addr}`)
        setTimeout(() => {
            return;
        }, 1500)
    } catch(e){
        return e;
    }
}