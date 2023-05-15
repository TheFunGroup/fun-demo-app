import Layout from '../components/layout';
import StakingModal from "../components/modals/StakingModal";
export default function Stake() {
    return (
      <div className="w-full flex flex-col items-center">
        <StakingModal example="stake"/>
      </div>
    )
}

Stake.getLayout = function getLayout(page) {
  return (
    <Layout>{page}</Layout>
  )
}
