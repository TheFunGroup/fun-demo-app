import Layout from '../components/layout';
import Example from "../components/modals/Example";

export default function Swap() {
    return (
      <div className="w-full flex flex-col items-center">
        <Example example="swap"/>
      </div>
    )
}

Swap.getLayout = function getLayout(page) {
  return (
    <Layout>{page}</Layout>
  )
}
