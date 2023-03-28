import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Image from 'next/image';
import Layout from '../components/layout';
import Deployed from "../components/modals/Deployed";
import { useFun } from "../contexts/funContext";

export default function Success() {    
    return (
      <div className="w-full flex flex-col items-center">
          <Deployed />
      </div>
    )
}

Success.getLayout = function getLayout(page) {
  return (
    <Layout>{page}</Layout>
  )
}
