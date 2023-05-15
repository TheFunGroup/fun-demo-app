import Layout from '../components/layout';
import Bridge from '../components/modals/BridgingModal';
export default function Stake() {
    return (
      <div className="w-full flex flex-col items-center">
        <Bridge example="bridge"/>
      </div>
    )
}

Stake.getLayout = function getLayout(page) {
  return (
    <Layout>{page}</Layout>
  )
}
