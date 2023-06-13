import { ethers } from "ethers"
import nftABI from "../utils/nftABI.json"

export const handleGetNFTs = async function (wallet) {
    let nfts = []
    try {
        const provider = new ethers.providers.JsonRpcProvider("https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161")
        const nft = new ethers.Contract("0x2749B15E4d39266A2C4dA9c835E9C9e384267C5A", nftABI, provider)
        const tokenIds = await nft.ownedTokenId(wallet.address)
        for (let i = 0; i < tokenIds.length; i++) {
            const tokenURI = await nft.tokenURI(tokenIds[i])
            nfts.push({
                uri: tokenURI
            })
        }
        return { success: true, nfts: nfts }
    } catch (e) {
        console.log(e)
        return { success: false, error: e.toString() }
    }
}
