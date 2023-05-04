import { useRouter } from "next/router";
import { useFun } from "../../contexts/funContext";

export default function Minted(props) {

  const router = useRouter();
  const { deployedUrl, minted } = useFun()

  return (
    <div className="modal w-[420px] my-24 flex flex-col items-center">
      
      <div className="flex items-center">
        <img width="112" height="112" className="border-[4px] border-[#F2F6F7] rounded-[20px] z-10" src={`/nft${minted}.png`}/>
        <div width="112" height="112" className="border-[4px] border-[#F2F6F7] minted flex items-center justify-center rounded-[20px] -ml-3">
           <img width="64" height="64" src={`/mint-white.svg`}/>
        </div>
      </div>

      <div className="text-[#667085] mt-6 whitespace-nowrap">You've Minted</div>

      <div className="text-[#101828] font-semibold text-2xl mt-1">{`NFT #000${minted}`}</div>
      <div className="text-[#74777C] mt-12 whitespace-nowrap">Ready to check out your new NFT?</div>
      <div className="flex items-center cursor-pointer mt-1" onClick={() => router.push("/?view=nfts")}>
        <img width="20" height="20" src="/media.svg" className="mr-[6px]"/>
        <div className="text-[#2B2F43] font-semibold text-sm">View Minted NFTs</div>
      </div>
      <div className="w-full button-dark p-3 font-medium text-center mt-12" onClick={() => router.push("/")}>Done</div>
    </div>
  )
}
