import { useEffect, useState, useRef } from "react";
import Image from 'next/image';
import { useOnClickOutside } from "../../hooks/useOnClickOutside";
import { networks } from "../../utils/networks";
import { useFun } from "../../contexts/funContext";
import { ethers } from "ethers";
import { toUSD } from "../../scripts/prices";
import { handleGetNFTs } from "../../scripts/getNFTs";
import { useRouter } from "next/router";
import { disconnect } from '@wagmi/core'
import erc20Abi from "../../utils/erc20Abi";

export default function WalletView(props) {

  const { wallet, setWallet, eoa, setEOA, network, setLoading } = useFun()

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

  const [nfts, setNfts] = useState([])

  const [tab, setTab] = useState("balance");

  useEffect(() => {
    if (networks[network]) {
      if (wallet.address) {
        setAddr(wallet.address);
        let provider = eoa.signer ? eoa.signer.provider : eoa.provider;
        provider.getBalance(wallet.address).then((balance) => {
          balance = ethers.utils.formatEther(balance);
          setBalance(Number(balance).toFixed(6))
          toUSD("ETH", balance).then((usd) => {
            setBalanceUSD(usd)
          })
        }).catch((e) => {
          console.log(e)
        });
        getCoinBalances(provider);
        getNFTs()
      }
    }
  }, [network, dropdown])

  async function getCoinBalances(provider) {
    const usdcContract = new ethers.Contract("0xaa8958047307da7bb00f0766957edec0435b46b5", erc20Abi, provider);
    let usdcBalance = await usdcContract.balanceOf(wallet.address)
    usdcBalance = ethers.utils.formatUnits(usdcBalance, 6)
    setUsdcBalance(Number(usdcBalance.toString()).toFixed(2))
    setUsdcBalanceUSD(await toUSD("USDC", usdcBalance));

    const daiContract = new ethers.Contract("0x855af47cdf980a650ade1ad47c78ec1deebe9093", erc20Abi, provider);
    let daiBalance = await daiContract.balanceOf(wallet.address)
    daiBalance = ethers.utils.formatUnits(daiBalance, 6)
    setDaiBalance(Number(daiBalance.toString()).toFixed(2))
    setDaiBalanceUSD(await toUSD("DAI", daiBalance));

    const usdtContract = new ethers.Contract("0x3E1FF16B9A94eBdE6968206706BcD473aA3Da767", erc20Abi, provider);
    let usdtBalance = await usdtContract.balanceOf(wallet.address)
    usdtBalance = ethers.utils.formatUnits(usdtBalance, 6)
    setUsdtBalance(Number(usdtBalance.toString()).toFixed(2))
    setUsdtBalanceUSD(await toUSD("USDT", usdtBalance));
  }

  async function getNFTs(){
    const data = await handleGetNFTs(wallet, eoa);
    if(data.nfts){
      setNfts(data.nfts);
    }
  }

  useOnClickOutside(dropdownRef, (e) => {
    if (walletBtnRef?.current?.contains(e.target) || e.target == walletBtnRef?.current) return;
    setDropdown(false)
  })

  useEffect(() => {
    if (!dropdown) setShowSettings(false)
  }, [dropdown])

  useEffect(() => {
    if (router.query.view) {
      if (router.query.view == "nfts") {
        setTab("nfts")
        setDropdown(true);
      }
    }
  }, [router.query])

  function handleCopyAddr() {
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

  function handleLogout() {
    disconnect();
    setWallet(null)
    setEOA(null)
  }

  function handleFund() {
    setLoading(true);
    router.push("/fund")
  }

  function handleDropdown() {
    if (!dropdown) {
      setTimeout(() => {
        setDropdown(true)
      }, 100)
    } else {
      setDropdown(false)
    }
  }

  return (
    <div>
      {addr && (
        <div className="w-[164px] flex items-center cursor-pointer" onClick={handleDropdown} ref={walletBtnRef}>
          <Image src="/profile.svg" width="28" height="28" alt="" />
          <div className="text-[#667085] text-sm mx-2 font-mono max-w-[104px]">{`${addr.substring(0, 5)}...${addr.substring(addr.length - 4)}`}</div>
          <Image src="/chevron.svg" width="20" height="20" style={dropdown && { transform: "rotate(-180deg)" }} alt=""
            className="duration-200 ease-linear"
          />
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
                <Image src="/gear.svg" width="24" height="24" alt="" className="cursor-pointer" onClick={() => setShowSettings(true)} />
              </div>
              {tab == "balance" && (
                <div className="p-6 pt-0 w-full flex items-center flex-col max-h-[427px] overflow-y-scroll">
                  <Image src="/profile.svg" width="80" height="80" className="mt-4" alt="" />
                  <div className="flex items-end">
                    <div className="text-[32px] font-semibold mr-1">{Number(balance).toFixed(6)}</div>
                    <div className="text-[#667085] mb-2">{networks[network]?.nativeCurrency.symbol}</div>
                  </div>
                  <div className="text-[#667085] text-lg -mt-1">{`$${balanceUSD} USD`}</div>
                  <div className="button-dark text-center py-3 px-4 w-full mt-6 font-medium" onClick={handleFund}>Fund</div>
                  <div className="self-start text-black text-lg font-[590] mt-6 mb-2">Coins</div>

                  {usdcBalance && (
                    <div className="w-full flex justify-between items-center my-2 mb-[6px]">
                      <div className="flex items-center">
                        <Image src="/usdc-coin.svg" width="40" height="40" alt="" className="mr-4" />
                        <div>
                          <div className="text-black">USD Coin</div>
                          <div className="text-[#667085] text-sm">{`${usdcBalance} USDC`}</div>
                        </div>
                      </div>
                      <div className="text-black">{`$${usdcBalanceUSD}`}</div>
                    </div>
                  )}

                  {daiBalance && (
                    <div className="w-full flex justify-between items-center my-[6px]">
                      <div className="flex items-center">
                        <Image src="/dai-coin.svg" width="40" height="40" alt="" className="mr-4" />
                        <div>
                          <div className="text-black">DAI</div>
                          <div className="text-[#667085] text-sm">{`${daiBalance} DAI`}</div>
                        </div>
                      </div>
                      <div className="text-black">{`$${daiBalanceUSD}`}</div>
                    </div>
                  )}

                  {usdtBalance && (
                    <div className="w-full flex justify-between items-center mt-[6px]">
                      <div className="flex items-center">
                        <Image src="/usdt-coin.svg" width="40" height="40" alt="" className="mr-4" />
                        <div>
                          <div className="text-black">USD Tether</div>
                          <div className="text-[#667085] text-sm">{`${usdtBalance} USDT`}</div>
                        </div>
                      </div>
                      <div className="text-black">{`$${usdtBalanceUSD}`}</div>
                    </div>
                  )}

                </div>
              )}

              {tab == "nfts" && (
                <div className="w-full max-h-[427px] min-h-[427px] overflow-y-scroll p-6 pt-0 flex flex-col items-center">
                  <div className="w-full flex items-center justify-between my-6">
                    <div className="flex items-center">
                      <div className="text-xl font-semibold text-black mr-1">NFTs</div>
                      <div className="text-[#74777C] text-xl font-semibold">{nfts.length}</div>
                    </div>
                    <div className="flex items-center cursor-pointer" onClick={() => router.push("/nft")}>
                      <img width="20" height="20" src="/mint-fill.svg" />
                      <div className="text-[#2D4EA2] text-sm font-semibold ml-1">Mint an NFT</div>
                    </div>
                  </div>
                  {nfts.map((nft) => {
                    return (
                      <img src={`${nft.uri}`} width="312" height="312" className="mb-2 rounded-2xl" />
                    )
                  })}
                </div>
              )}


              <div className="w-full border-t-[1px] border-[#E4E7EC] flex items-center h-[64px]">
                <div
                  className={`w-full h-[64px] flex items-center justify-center ${tab == "balance" ? "" : "cursor-pointer opacity-50"}`}
                  onClick={() => setTab("balance")}
                >
                  <img src="home.svg" width="24" height="24" />
                </div>
                <div
                  className={`w-full h-[64px] flex items-center justify-center ${tab == "nfts" ? "" : "cursor-pointer opacity-50"}`}
                  onClick={() => setTab("nfts")}
                >
                  <img src="nfts.svg" width="24" height="24" />
                </div>
              </div>

            </div>
          )}

          {showSettings && (
            <div className="flex flex-col items-center w-full">
              <div className="flex items-center w-full justify-between py-[19px] px-6 border-b-[1px] border-[#00000014]">
                <div className="text-black mr-2 whitespace-nowrap font-bold text-sm">Settings</div>
                <Image src="/close.svg" width="22" height="22" alt="" className="cursor-pointer" onClick={() => setShowSettings(false)} />
              </div>
              <a className="w-full" href={`https://goerli.etherscan.io/address/${addr}`} target="_blank">
                <div className="settingsBtn">
                  <div className="flex items-center">
                    <Image src="/explorer.svg" width="24" height="24" alt="" className="mr-3" />
                    <div className="text-black font-medium">View Block Explorer</div>
                  </div>
                  <Image src="/open.svg" width="20" height="20" alt="" />
                </div>
              </a>
              <a className="w-full" href={`mailto:support@fun.xyz`} target="_blank">
                <div className="settingsBtn">
                  <div className="flex items-center">
                    <Image src="/mail.svg" width="24" height="24" alt="" className="mr-3" />
                    <div className="text-black font-medium">Contact Fun Support</div>
                  </div>
                  <Image src="/open.svg" width="20" height="20" alt="" />
                </div>
              </a>

              <div className="settingsBtn" onClick={handleLogout}>
                <div className="flex items-center">
                  <Image src="/leave.svg" width="24" height="24" alt="" className="mr-3" />
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
