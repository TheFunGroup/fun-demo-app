import { ethers } from "ethers";
import { configureEnvironment } from "fun-wallet/managers";
import { TokenSponsor } from "fun-wallet/sponsors";
import { Token } from "fun-wallet/data";
import { tokens } from "../utils/tokens"
import erc20ABI from "../utils/funTokenAbi.json";
import { isContract } from "./wallet";
import nftABI from "../utils/nftABI.json"
import { apiKey } from "../utils/constants";

export const handleGetNFTs = async function (wallet, auth) {
  const nfts = [
    {
      id: "0xv34tt34n934tntvhe4itev",
      uri: "/nft1.png"
    },
    {
      id: "0xu4vtevhevi4t4etw3y9w3vr",
      uri: "/nft2.png"
    }
  ];
  try {
    return { success: true, nfts: nfts}
  } catch (e) {
    console.log(e)
    return { success: false, error: e }
  }
}

