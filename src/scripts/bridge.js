
import { tokens } from "../utils/tokens";
import { networks } from "../utils/networks";

// TODO implement support for verifying the asset to be bridged is in fact on the network being bridged from.
export const verifyBridgeParams = (fromNetwork, toNetwork, fromAsset, toAsset, amount) => {
    if (networks[fromNetwork] == null) return false;
    if (networks[toNetwork] == null) return false;
    if (tokens[fromNetwork][fromAsset] == null) return false;
    if (tokens[toNetwork][toAsset] == null) return false;
    if (amount <= 0) return false;
    return true
};



/**
 * Given two chains and two addresses on those chains, bridge the asset from one chain to the other.
 * @param {obj} params should have the following fields
 * {
 *   fromChainId: number (chain id you are bridging the asset from)
 *   toChainId: number (chain id you are bridging the asset to)
 *   fromAssetAddress: string (address of the asset on fromChainId's chain)
 *   toAssetAddress: string (address of the asset you want to receive on toChainId's chain)
 *   amount: number (amount of the from asset you want to input - make sure to take decimals into account)
 *   sort: string Can sort routes by "output"(Maximize number of tokens received) | 
 *         "gas"(Minimize gas costs) | "time"(Minimize bridging time)
 * }
 * @returns {obj} approveAndExec transaction
 */
export const handleBridge = async function (wallet, provider, auth, paymentToken, params, callOptions) {
    try {
        const {fromChainId, toChainId, fromAssetAddress, toAssetAddress, amount, userAddress} = params;

      const walletAddress = await wallet.getAddress()

      let tempEnvOptions = {
        chain: fromChainId,
        apiKey,
        gasSponsor: false
      }
      // // Tells frontend that funwallet must be funded  
      if (paymentToken != "ETH" && paymentToken != "gasless") { //use paymaster
        tempEnvOptions = {
          chain: fromChainId,
          apiKey,
          gasSponsor: {
            sponsorAddress: "0x07Ac5A221e5b3263ad0E04aBa6076B795A91aef9",
            token: paymentToken
          }
        };
  
        const gasSponsor = new TokenSponsor()
  
        const paymasterAddress = await gasSponsor.getPaymasterAddress()
        const iscontract = await isContract(walletAddress)
        if (iscontract) {
          const erc20Contract = new ethers.Contract(paymentToken, erc20ABI.abi, provider)
          let allowance = await erc20Contract.allowance(walletAddress, paymasterAddress)//paymaster address
          allowance = ethers.utils.formatUnits(allowance, 6);
  
          if (Number(allowance) < Number(20)) {//amt
            //if approved, pop up modal, and ask for approval
            return { success: false, mustApprove: true, paymasterAddress, tokenAddr: paymentToken }
  
          }
        } else {
          return { success: false, error: "Its a known bug that first transaction of a fun wallet would fail if you are covering gas using ERC20 tokens. Please try to pay gas using gasless paymaster or ETH for this transaction and try token paymaster later." }
        }
      }
      else if(paymentToken=="gasless"){
        tempEnvOptions ={
          chain: fromChainId,
          apiKey,
          gasSponsor: {
            sponsorAddress: '0x07Ac5A221e5b3263ad0E04aBa6076B795A91aef9',
          }
        };
      }

      try {
        const receipt = await wallet.bridge(auth, params, {...tempEnvOptions, gasLimit: 300000});
      //Tells frontend stake was success
      console.log("txId: ",receipt, receipt.txid)
      const explorerUrl = receipt.txid ? `https://goerli.etherscan.io/tx/${receipt.txid}` : `https://goerli.etherscan.io/address/${walletAddress}#internaltx`
      return { success: true, explorerUrl}
  
  
      } catch (err) {
        return { success: false, error: err.toString() }
      }
  
  
  
    } catch (e) {
      console.log(e)
      return { success: false, error: e.toString() }
    }
  
  }