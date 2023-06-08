import React from "react";
import Image from "next/image";
export default function UpdateBanner(props) {
  return (
    <>
      <div className="fixed inset-0 flex items-start justify-center bg-black bg-opacity-50 pointer-events-none"></div>
      <div className="fixed w-full h-full flex items-start justify-center">
      <div
        className={`modalShadow w-[464px] h-[272px] mt-16 my-12 flex flex-col justify-start bg-white rounded-2xl z-50 pointer-events-auto`}
      >
        <div className={"flex justify-center mt-8"}>
          <Image src="/fun.svg" width="52" height="42" alt="" />
        </div>
        <div className="flex flex-col items-start px-12 mt-4">
          <div className="font-semibold text-2xl mt-6 text-[#101828]">{`We are upgrading this demo`}</div>
          <div className="text-base text-[#101828] mt-3">The demo app is temporarily unavailable as we work on enhancing its functionality. In the meantime, check out our <a href="https://docs.fun.xyz/" className="underline text-[#2D4EA2]">docs</a></div>

        </div>
      </div>
      </div>
    </>
  );
}
