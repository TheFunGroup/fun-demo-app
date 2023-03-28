import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Image from 'next/image';
import Layout from '../components/layout';
import FundWallet from "../components/modals/FundWallet";
import { useFun } from "../contexts/funContext";

export default function Fund() {
  return (
    <div className="w-full flex flex-col items-center">
      <FundWallet />
    </div>
  )
}

Fund.getLayout = function getLayout(page) {
  return (
    <Layout>{page}</Layout>
  )
}
