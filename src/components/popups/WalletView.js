import { useEffect, useState, useRef } from "react";
import Image from 'next/image';
import { useOnClickOutside } from "../../hooks/useOnClickOutside";
import { networks } from "../../utils/networks";
import { useFun } from "../../contexts/funContext";
import { ethers } from "ethers";
import { toUSD } from "../../scripts/prices";
import { useRouter } from "next/router";
import erc20Abi from "../../utils/erc20Abi";

export default function WalletView(props) {

  const { wallet, setWallet, eoa, setEOA, network, setLoading} = useFun()

  const router = useRouter()
  const [addr, setAddr] = useState()
  const [balance, setBalance] = useState();
  const [balanceUSD, setBalanceUSD] = useState();
  const [dropdown, setDropdown] = useState();
  const dropdownRef = useRef()
  const walletBtnRef = useRef()
  const [showCopy, setShowCopy] = useState(false)
  const [copying, setCopying] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const [usdcBalance, setUsdcBalance] = useState();
  const [usdcBalanceUSD, setUsdcBalanceUSD] = useState();
  const [daiBalance, setDaiBalance] = useState();
  const [daiBalanceUSD, setDaiBalanceUSD] = useState();
  const [usdtBalance, setUsdtBalance] = useState();
  const [usdtBalanceUSD, setUsdtBalanceUSD] = useState();


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
        
        getCoinBalances();
        
      }
    }
  }, [network])

  async function getCoinBalances(){
    const usdcContract = new ethers.Contract("0x824b8e927417276b6643e9fc830176ce18dfc6f8" , erc20Abi, eoa.signer.provider);
    let usdcBalance = await usdcContract.balanceOf(wallet.address)
    usdcBalance = ethers.utils.formatEther(usdcBalance);
    setUsdcBalance(Number(usdcBalance).toFixed(2))
    setUsdcBalanceUSD(await toUSD("USDC", usdcBalance));

    const daiContract = new ethers.Contract("0xae8cc06365253284eea8c23192c410b19a7a1224" , erc20Abi, eoa.signer.provider);
    let daiBalance = await daiContract.balanceOf(wallet.address)
    daiBalance = ethers.utils.formatEther(daiBalance);
    setDaiBalance(Number(daiBalance).toFixed(2))
    setDaiBalanceUSD(await toUSD("DAI", daiBalance));

    const usdtContract = new ethers.Contract("0x92db1cebe8770acbc0cf321a5e71746c4097c995" , erc20Abi, eoa.signer.provider);
    let usdtBalance = await usdtContract.balanceOf(wallet.address)
    usdtBalance = ethers.utils.formatEther(usdtBalance);
    setUsdtBalance(Number(usdtBalance).toFixed(2))
    setUsdtBalanceUSD(await toUSD("USDT", usdtBalance));

  }

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
    setCopying(true)
    setTimeout(() => {
      setCopying(false)
    }, 1500)
  }

  function handleLogout(){
    setWallet(null)
    setEOA(null)
  }

  function handleFund(){
    setLoading(true);
    router.push("/fund")
  }

  return (
    <div>
      {addr && (
        <div className="w-[164px] flex items-center cursor-pointer" onClick={() => setDropdown(!dropdown)} ref={walletBtnRef}>
          <Image src="/profile.svg" width="24" height="24" alt=""/>
          <div className="text-[#667085] text-sm mx-2 font-mono max-w-[104px]">{`${addr.substring(0, 5)}...${addr.substring(addr.length - 4)}`}</div>
          <Image src="/chevron.svg" width="20" height="20" style={dropdown && {transform: "rotate(180deg)"}}/>
        </div>
      )}
      {dropdown && (
        <div className="dropdown w-[343px] absolute mt-2 -ml-[172px] pt-0 " ref={dropdownRef}>
          {!showSettings && (
            <div className="flex flex-col items-center w-full">
              <div className="flex items-center w-full justify-between py-[18px] px-6 border-b-[1px] border-[#00000014]">
                <div className="flex items-center text-sm"> 
                  <div className="text-black mr-2 whitespace-nowrap font-bold">Fun Wallet</div>
                  <div 
                    onMouseEnter={() => setShowCopy(true)}
                    onMouseLeave={() => setShowCopy(false)}
                    onClick={handleCopyAddr}
                    className="cursor-pointer mt-[2px]"
                  >
                    {showCopy && (<div className="copy">{copying ? "Copied!" : "Click to Copy"}</div>)}
                    <div className="font-mono text-[#667085] mr-1" >{`${addr.substring(0, 5)}...${addr.substring(addr.length - 4)}`}</div>
                  </div>
                </div>
                <Image src="/gear.svg" width="18" height="18" alt="" className="cursor-pointer" onClick={() => setShowSettings(true)}/>
              </div>
              <div className="p-6 pt-0 w-full flex items-center flex-col">
                <Image src="/profile.svg" width="80" height="80" className="mt-4" alt=""/>
                <div className="flex items-end">
                  <div className="text-[32px] font-semibold mr-1">{Number(balance).toFixed(2)}</div>
                  <div className="text-[#667085] mb-2">{networks[ethereum.networkVersion]?.nativeCurrency.symbol}</div>
                </div>
                <div className="text-[#667085]">{`$${balanceUSD} USD`}</div>
                <div className="button-dark text-center py-3 px-4 w-full mt-4" onClick={handleFund}>Fund</div>
                <div className="self-start text-black text-lg font-medium mt-6 mb-2">Coins</div>
                
                {usdcBalance && (
                  <div className="w-full flex justify-between items-center my-1">
                    <div className="flex items-center">
                      <Image src="/usdc.svg" width="40" height="40" alt="" className="mr-4"/>
                      <div>
                        <div className="text-black">USD Coin</div>
                        <div className="text-[#667085]">{`${usdcBalance} USDC`}</div>
                      </div>
                    </div>
                    <div className="text-black">{`$${usdcBalanceUSD}`}</div>
                  </div>
                )}

                {daiBalance && (
                  <div className="w-full flex justify-between items-center my-1">
                    <div className="flex items-center">
                      <Image src="/dai.svg" width="40" height="40" alt="" className="mr-4"/>
                      <div>
                        <div className="text-black">DAI</div>
                        <div className="text-[#667085]">{`${daiBalance} DAI`}</div>
                      </div>
                    </div>
                    <div className="text-black">{`$${daiBalanceUSD}`}</div>
                  </div>
                )}

                {usdtBalance && (
                  <div className="w-full flex justify-between items-center mt-2">
                    <div className="flex items-center">
                      <Image src="/usdt.svg" width="40" height="40" alt="" className="mr-4"/>
                      <div>
                        <div className="text-black">USD Tether</div>
                        <div className="text-[#667085]">{`${usdtBalance} USDT`}</div>
                      </div>
                    </div>
                    <div className="text-black">{`$${usdtBalanceUSD}`}</div>
                  </div>
                )}

              </div>
            </div>
          )}

          {showSettings && (
            <div className="flex flex-col items-center w-full">
              <div className="flex items-center w-full justify-between py-[18px] px-6 border-b-[1px] border-[#00000014]">
                <div className="text-black text-lg mr-2 whitespace-nowrap font-medium">Settings</div>
                <Image src="/close.svg" width="24" height="24" alt="" className="cursor-pointer" onClick={() => setShowSettings(false)}/>
              </div>
              <a className="w-full" href={`https://goerli.etherscan.io/address/${addr}`} target="_blank">
                <div className="settingsBtn">
                  <div className="flex items-center">
                    <Image src="/explorer.svg" width="24" height="24" alt="" className="mr-3"/>
                    <div className="text-black font-medium">View Block Explorer</div>
                  </div>
                  <Image src="/open.svg" width="20" height="20" alt=""/>
                </div>
              </a>
              <a className="w-full" href={`mailto:support@fun.xyz`} target="_blank">
                <div className="settingsBtn">
                  <div className="flex items-center">
                    <Image src="/mail.svg" width="24" height="24" alt="" className="mr-3"/>
                    <div className="text-black font-medium">Contact Fun Support</div>
                  </div>
                  <Image src="/open.svg" width="20" height="20" alt=""/>
                </div>
              </a>

              <div className="settingsBtn" onClick={handleLogout}>
                <div className="flex items-center">
                  <Image src="/leave.svg" width="24" height="24" alt="" className="mr-3"/>
                  <div className="text-black font-medium">Logout</div>
                </div>
              </div>
              
            </div>

          )}

        </div> 
      )}
    </div>
  )
}
