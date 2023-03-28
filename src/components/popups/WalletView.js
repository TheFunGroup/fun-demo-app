import { useEffect, useState, useRef } from "react";
import Image from 'next/image';
import { useOnClickOutside } from "../../hooks/useOnClickOutside";
import { networks } from "../../utils/networks";
import { useFun } from "../../contexts/funContext";
import { ethers } from "ethers";
import { toUSD } from "../../scripts/prices";

export default function WalletView(props) {

  const { wallet, setWallet, eoa, setEOA, network } = useFun()

  const [addr, setAddr] = useState()
  const [balance, setBalance] = useState();
  const [balanceUSD, setBalanceUSD] = useState();
  const [dropdown, setDropdown] = useState();
  const dropdownRef = useRef()
  const walletBtnRef = useRef()

  useEffect(() => {
    if(networks[network || ethereum.networkVersion]){
      if(wallet.address){
        setAddr(wallet.address);
        eoa.signer.provider.getBalance(wallet.address).then((balance) => {
          balance = ethers.utils.formatEther(balance);
          setBalance(Number(balance).toFixed(2))
          toUSD("ETH", balance).then((usd) => {
            setBalanceUSD(usd)
          })
        });       
      }
    }
  }, [network])

  useOnClickOutside(dropdownRef, (e) => {
    if(walletBtnRef?.current?.contains(e.target) || e.target == walletBtnRef?.current) return;
    setDropdown(false)
  })

  function handleCopyAddr(){
    var copyText = document.createElement('input');
    copyText.style.position = "absolute";
    copyText.style.top = "-1250000px";
    copyText.value = addr;
    document.body.appendChild(copyText);
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(copyText.value);
  }

  function handleLogout(){
    setWallet(null)
    setEOA(null)
  }

  return (
    <div>
      {addr && (
        <div className="w-[164px] flex items-center cursor-pointer" onClick={() => setDropdown(!dropdown)} ref={walletBtnRef}>
          <Image src="/profile.svg" width="24" height="24" alt=""/>
          <div className="text-[#667085] text-sm mx-2 font-mono max-w-[104px]">{`${addr.substring(0, 5)}...${addr.substring(addr.length - 4)}`}</div>
          <Image src="/chevron.svg" width="20" height="20"/>
        </div>
      )}
      {dropdown && (
        <div className="dropdown w-[343px] absolute mt-2 -ml-[172px] pt-0 flex flex-col items-center" ref={dropdownRef}>
          
          <div className="flex items-center w-full justify-between py-[18px] px-6 border-b-[1px] border-[#00000014]">
            <div className="flex items-center text-sm"> 
              <div className="text-black mr-2 whitespace-nowrap font-bold">Fun Wallet</div>
              <div className="font-mono text-[#667085] mr-1" >{`${addr.substring(0, 5)}...${addr.substring(addr.length - 4)}`}</div>
            </div>
            <Image src="/gear.svg" width="18" height="18" alt="" className="cursor-pointer"/>
          </div>
          <div className="p-6 pt-0 w-full flex items-center flex-col">
            <Image src="/profile.svg" width="80" height="80" className="mt-4" alt=""/>
            <div className="flex items-end">
              <div className="text-[32px] font-semibold mr-1">{Number(balance).toFixed(2)}</div>
              <div className="text-[#667085] mb-2">{networks[ethereum.networkVersion]?.nativeCurrency.symbol}</div>
            </div>
            <div className="text-[#667085]">{`$${balanceUSD} USD`}</div>
            <div className="button text-center py-3 px-4 w-full mt-4" onClick={handleLogout}>Logout</div>
          </div>
          
        </div> 
      )}
    </div>
  )
}
