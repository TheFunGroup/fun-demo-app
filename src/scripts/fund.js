const FAUCETURL = "https://vyhjm494l3.execute-api.us-west-2.amazonaws.com/prod/demo-faucet/get-faucet"
export const handleFundWallet = async function (addr) {
    try {
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