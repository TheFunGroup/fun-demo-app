import Layout from '../components/layout';
import ApprovePM from "../components/modals/ApprovePM";

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
