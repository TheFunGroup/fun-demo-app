import { useEffect  } from "react";
import Layout from '../components/layout';
import FundWallet from "../components/modals/FundWallet";
import { useFun } from "../contexts/funContext";

export default function Fund() {

  const { setLoading } = useFun()

  useEffect(() => {
    setLoading(false)
  }, [])

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
