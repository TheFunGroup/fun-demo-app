import { ethers } from "ethers";

export const networks = {
  "137": {
    name: "Polygon",
    icon: "/polygon.svg",
    paymentIcon:"/matic-payment.png",
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18
    },
    blockExplorerUrls: ["https://polygonscan.com/"],
    rpcUrls: ["https://polygon-rpc.com/"]
  },
  "1": {
    name: "Ethereum",
    icon: "/ethereum.svg",
    paymentIcon:"/ethereum-payment.png",
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18
    },
  },
  "5": {
    name: "Goerli",
    icon: "/goerli.svg",
    paymentIcon:"/ethereum-payment.png",
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18
    },
  },
  "42161": {
    name: "Arbitrum One",
    icon: "/arbitrum.svg",
    paymentIcon:"/ethereum-payment.png",
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'AETH',
      decimals: 18
    },
    blockExplorerUrls: ["https://arbiscan.io/"],
    rpcUrls: ["https://arb1.arbitrum.io/rpc"]
  },
  "56": {
    name: "Binance",
    icon: "/bnb.svg",
    nativeCurrency: {
      name: "Binance Coin",
      symbol: "BNB",
      decimals: 18
    }
  }
}

export async function connectToNetwork(id){
  return new Promise(async (res, rej) => {
    const chain = ethers.utils.hexValue(Number(id));
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chain }],
      });
      return res()
    } catch(e){
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: chain,
              chainName: networks[id].name,
              nativeCurrency: networks[id].nativeCurrency,
              blockExplorerUrls: networks[id].blockExplorerUrls,
              rpcUrls: networks[id].rpcUrls
            },
          ],
        });
        return res();
      } catch(e){
        console.log(e)
        return res(e)
      }
    }
  })  
}