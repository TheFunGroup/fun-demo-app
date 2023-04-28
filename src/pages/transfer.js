import Layout from '../components/layout';
import Example from "../components/modals/Example";

export default function Transfer() {
  return (
    <div className="w-full flex flex-col items-center">
      <Example example="transfer"/>
    </div>
  )
}

Transfer.getLayout = function getLayout(page) {
  return (
    <Layout>{page}</Layout>
  )
}
