import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../components/layout";
import Example from "../components/modals/Example";
import { useFun } from "../contexts/funContext";

const NFT_DEMO_OPTIONS = [
  { id: 1, imgUrl: "/nft1.png", imgClassName: "bg-[url('/nft1.png')]", label: "NFT 1", subtext: "Fun Community Collection" },
  { id: 2, imgUrl: "/nft2.png", imgClassName: "bg-[url('/nft2.png')]", label: "NFT 2", subtext: "Fun Community Collection" }
]

export default function NFT() {
  const router = useRouter();
  const [selected, setSelected] = useState();
  const [ready, setReady] = useState(false);
  const { setLoading } = useFun();

  useEffect(() => {
    setLoading(false)
  }, [])

  return (
    <div className="w-full flex flex-col items-center">
      {!ready && (
        <div className="nftSelectModal w-[690px] mt-24">
          <div className="font-medium text-xl">Select & Mint a Fun NFT</div>
          <div className="flex w-full justify-between items-center mt-12">
            {NFT_DEMO_OPTIONS.map((item) => (
              <div
                key={item.id}
                className={`border-[1px] rounded-[12px] p-6 flex flex-col cursor-pointer ${selected === item.id ? "border-[#2D4EA2] bg-[#2d4ea214]" : "border-[#E4E7EC]"
                  }`}
                onClick={() => setSelected(item.id)}>
                <div className={`${item.imgClassName} w-[229px] h-[237px] rounded-[16px] bg-center bg-cover relative`}>
                  <div className="w-full h-full backdrop-blur	rounded-[16px] backdrop-brightness-75	" />
                  <img
                    src={item.imgUrl}
                    width="165"
                    height="173"
                    className="rounded-[28px] self-center top-9 left-8 absolute"
                  />
                </div>
                <div className="mt-8 text-lg font-medium">{item.label}</div>
                <div className="text-sm text-[#667085]">{item.subtext}</div>
              </div>
            ))}
          </div>

          <div className="flex items-center mt-12 w-full">
            <div className="w-full button p-4 font-medium text-[#344054] text-center mr-4" onClick={() => router.push("/")}>
              Cancel
            </div>
            <div
              className="w-full button-dark p-4 font-medium flex items-center justify-center"
              onClick={() => {
                setReady(true)
              }}
              style={!selected ? { opacity: 0.5, pointerEvents: "none" } : {}}>
              <div>Mint</div>
            </div>
          </div>
        </div>
      )}

      {ready && <Example example="nft" nft={selected} />}
    </div>
  )
}

NFT.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}
