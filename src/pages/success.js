import Layout from '../components/layout';
import Deployed from "../components/modals/Deployed";
import Minted from "../components/modals/Minted";
import { useFun } from "../contexts/funContext";

export default function Success() {    
  const {deployedUrl, minted} = useFun();
  return (
    <div className="w-full flex flex-col items-center">
      {(!minted && deployedUrl) && (
        <Deployed />
      )}
      {(minted && deployedUrl) && (
        <Minted />
      )}
    </div>
  )
}

Success.getLayout = function getLayout(page) {
  return (
    <Layout>{page}</Layout>
  )
}
