import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from 'next/image';
import NetworkSelect from "../popups/NetworkSelect";
import WalletView from "../popups/WalletView";
import { useFun } from "../../contexts/funContext";

export default function Main(props) {

  const router = useRouter();

  const { wallet, setLoading } = useFun();

  const [walletCreated, setWalletCreated] = useState()

  useEffect(() => {
    if(localStorage.getItem("fun-wallet-addr") !== wallet?.address && !wallet.deployed){
      setWalletCreated(true);
      localStorage.setItem("fun-wallet-addr", wallet.address)
      setTimeout(() => {
        setWalletCreated(false)
      }, 2500)
    }
  }, [wallet])

  function goToPage(path){
    setLoading(true);
    router.push(path)
  }

  return (
    <div className="modal w-[690px] -mt-[64px]">

      {walletCreated && (
        <div className="alert w-full flex justify-between -mb-[58px] relative">
          <div className="flex items-center">
            <Image src="/created.svg" width="24" height="24" alt=""/>
            <div className="text-[#101828] font-medium ml-3">{`Congrats! Fun Wallet Created`}</div>
          </div>
        </div>
      )}

      <div className="w-full flex p-2 justify-between">
        <div className="">
          <div className="text-[#101828] font-semibold text-xl">Welcome!</div>
          <div className="text-[#667085] text-sm mt-1 whitespace-nowrap">Explore the possibilities of a Fun Wallet!</div>
        </div>
        <div className="w-full flex flex-col items-end">
          <div className="flex">
            <NetworkSelect />
            <WalletView />
          </div>
          {/* <a href="https://shuttleone.io/testnet/faucet.html" target="_blank"><div className="button text-[#667085] text-sm rounded-md border-[1px] border-[#667085] mt-3 cursor-pointer px-2">Goerli Faucet</div></a> */}
        </div>
      </div>
      <div className="w-full mt-6">
        <div className="button flex items-center text-sm p-4" onClick={() => goToPage("/nft")}>
          <Image src="/mint.svg" width="40" height="40" alt=""/>
          <div className="ml-3">
            <div className="font-medium text-[#344054]">Mint NFT</div>
            <div className="text-[#667085]">Create a Non-Fungible Token on the Ethereum blockchain.</div>
          </div>
        </div>
        <div className="button flex items-center text-sm p-4 mt-4" onClick={() => goToPage("/swap")}>
          <Image src="/swap.svg" width="40" height="40" alt=""/>
          <div className="ml-3">
            <div className="font-medium text-[#344054]">Uniswap</div>
            <div className="text-[#667085]">A decentralized exchange protocol that enables automated liquidity provision and trading on Ethereum.</div>
          </div>
        </div>
        <div className="button flex items-center text-sm mt-4 p-4" onClick={() => goToPage("/transfer")}>
          <Image src="/transfer.svg" width="40" height="40" alt=""/>
          <div className="ml-3">
            <div className="font-medium text-[#344054]">Token Transfer</div>
            <div className="text-[#667085]">A smart wallet is the secure movement of digital assets from one wallet to another.</div>
          </div>
        </div>
      </div>
    </div>
  )
}
