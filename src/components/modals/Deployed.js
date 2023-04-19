import { useRouter } from "next/router";
import Image from 'next/image';
import { useFun } from "../../contexts/funContext";

export default function Deployed(props) {

  const router = useRouter();
  const { deployedUrl } = useFun()

  return (
    <div className="modal w-[690px] my-12">
      <Image src="/success.svg" width="48" height="48" alt=""/>
      <div className="text-[#101828] font-semibold text-xl mt-6">Action Deployed</div>
      <div className="text-[#667085] text-sm mt-1 whitespace-nowrap">Your transaction has been deployed to the chain! Please find on the block explorer.</div>
      <div className="flex w-full items-center justify-between mt-6 text-center">
        <div className="w-[315px] button p-3 font-medium text-[#344054]" onClick={() => router.push("/")}>Back</div>
        <a href={deployedUrl} target="_blank">
          <div className="w-[315px] button-dark p-3 font-medium" onClick={() => router.push("/")}>Block Explorer</div>
        </a>
      </div>
    </div>
  )
}
