import { configureEnvironment } from "fun-wallet"
//Amount is in USDC
export const handleApprove = async function (wallet, auth, paymasterAddress, paymentAddr, amount = 20000000000000000000) {
    await configureEnvironment({
        gasSponsor: false
    })
    await wallet.approve(auth, { spender: paymasterAddress, token: paymentAddr, amount: amount })

    return { success: true }
}
