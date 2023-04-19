import Layout from '../components/layout';
import Deployed from "../components/modals/Deployed";

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
