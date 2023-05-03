import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import Layout from '../components/layout';
import Example from "../components/modals/Example";
import { useFun } from "../contexts/funContext";

export default function NFT() {

  const router = useRouter()
  const [selected, setSelected] = useState();
  const [ready, setReady] = useState(false);
  const {setLoading} = useFun();

  useEffect(() => {
    setLoading(false)
  }, [])

  return (
    <div className="w-full flex flex-col items-center">
      
      {!ready && (
        <div className="nftSelectModal w-[690px] mt-24">
          <div className="font-medium text-xl">Select & Mint a Fun NFT</div>
          <div className="flex w-full justify-between items-center mt-12">
            <div 
              className={`border-[1px] rounded-[12px] p-6 flex flex-col cursor-pointer ${selected == 1 ? "border-[#2D4EA2] bg-[#2d4ea214]" : "border-[#E4E7EC]"} `}
              onClick={() => setSelected(1)}
            >
              <div className="bg-[url('/nft1.png')] w-[229px] h-[237px] rounded-[16px] bg-center bg-cover">
                <div className="w-full h-full backdrop-blur	rounded-[16px] backdrop-brightness-75	"></div>
              </div>
              <img src="/nft1.png" width="165" height="173" className="rounded-[28px] absolute mt-9 self-center"/>
              <div className="mt-8 text-lg font-medium">NFT 1</div>
              <div className="text-sm text-[#667085]">Fun Community Collection</div>
            </div>
            <div 
              className={`border-[1px] rounded-[12px] p-6 flex flex-col cursor-pointer ${selected == 2 ? "border-[#2D4EA2] bg-[#2d4ea214]" : "border-[#E4E7EC]"}`}
              onClick={() => setSelected(2)}
            >
              <div className="bg-[url('/nft2.png')] w-[229px] h-[237px] rounded-[16px] bg-center bg-cover">
                <div className="w-full h-full backdrop-blur	rounded-[16px] backdrop-brightness-75	"></div>
              </div>
              <img src="/nft2.png" width="175" height="180" className="rounded-[28px] absolute mt-9 self-center"/>
              <div className="mt-8 text-lg font-medium">NFT 2</div>
              <div className="text-[#667085] text-sm">Fun Community Collection</div>
            </div>
          </div>


          <div className="flex items-center mt-12 w-full">
            <div className="w-full button p-4 font-medium text-[#344054] text-center mr-4" onClick={() => router.push("/")}>Cancel</div>
            <div 
              className="w-full button-dark p-4 font-medium flex items-center justify-center"
              onClick={() => {setReady(true)}}
              style={ !selected ? { opacity: 0.5, pointerEvents: "none" } : {}}
            > 
              <div>Mint</div>
          </div>

          </div>

        </div>
      )}
      
      {ready && (
        <Example example="nft" nft={selected} />
      )}
    </div>
  )
}

NFT.getLayout = function getLayout(page) {
  return (
    <Layout>{page}</Layout>
  )
}
