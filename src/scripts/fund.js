const FAUCETURL = "https://kjj7i5hi79.execute-api.us-west-2.amazonaws.com/prod/demo-faucet/"
export const handleFundWallet = async function (addr) {
    try {
        await fetch(`${FAUCETURL}get-faucet?token=eth&testnet=goerli&addr=${addr}`)
        await fetch(`${FAUCETURL}get-faucet?token=usdc&testnet=goerli&addr=${addr}`)
        await fetch(`${FAUCETURL}get-faucet?token=dai&testnet=goerli&addr=${addr}`)
        await fetch(`${FAUCETURL}get-faucet?token=usdt&testnet=goerli&addr=${addr}`)
        await fetch(`${FAUCETURL}stake-token?testnet=goerli&addr=${addr}`)

        setTimeout(() => {
            return;
        }, 1500)
    } catch(e){
        return e.toString();
    }
}