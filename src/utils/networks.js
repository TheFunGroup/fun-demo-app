import { ethers } from "ethers";

export const networks = {
  "137": {
    name: "Polygon",
    icon: "/polygon.svg",
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
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18
    },
  },
  "5": {
    name: "Goerli",
    icon: "/goerli.svg",
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18
    },
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