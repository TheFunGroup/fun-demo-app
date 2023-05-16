import { ethers } from "ethers";

export const getTransactionStatus = async (txHash) => {
    return new Promise((resolve, reject) => {
        const provider = new ethers.providers.JsonRpcProvider("https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161");
        provider.getTransactionReceipt(txHash)
        .then((txObj) => {
            resolve(txObj)
        })
        .catch((err) => {
            reject(err)
        })

    })
}

export const getBlockTimestamp = async (blockNumber) => {
    return new Promise((resolve, reject) => {
        const provider = new ethers.providers.JsonRpcProvider("https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161");
        provider.getBlock(blockNumber)
        .then((block) => {
            resolve(block.timestamp)
        })
        .catch((err) => {
            reject(err)
        })

    })
}

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Nov", "Dec"]

export const unixTimestampToDate = (unixTimestamp) =>{
    const milliseconds = unixTimestamp * 1000;
    const dateObject = new Date(milliseconds);
    const humanTime = dateObject.toLocaleString().split(", ");
    return { date: `${months[dateObject.getMonth()]} ${dateObject.getDate()} ${dateObject.getFullYear()}`, time:  humanTime[1]};
  }