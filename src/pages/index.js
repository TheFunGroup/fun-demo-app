import Layout from '../components/layout';
import { useFun } from "../contexts/funContext";
import Main from "../components/modals/Main";

export default function Home() {

    const {wallet, network} = useFun();

    return (
      <div className="w-full flex flex-col items-center pt-[200px]">
        
        {(wallet && network) && (
          <div className="w-full flex flex-col items-center">
            <Main />
          </div>
        )}

      </div>
    )
}

Home.getLayout = function getLayout(page) {
  return (
    <Layout>{page}</Layout>
  )
}
