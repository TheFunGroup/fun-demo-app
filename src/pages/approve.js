import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Image from 'next/image';
import Layout from '../components/layout';
import ApprovePM from "../components/modals/ApprovePM";
import { useFun } from "../contexts/funContext";

export default function Approve() {
    return (
      <div className="w-full flex flex-col items-center">
        <ApprovePM />
      </div>
    )
}

Approve.getLayout = function getLayout(page) {
  return (
    <Layout>{page}</Layout>
  )
}
