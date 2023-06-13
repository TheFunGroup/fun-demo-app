import Layout from '../components/layout';
import TransactionStatusModal from '../components/modals/TransactionStatusModal';
export default function Transaction() {
    return (
      <div className="w-full flex flex-col items-center">
        <TransactionStatusModal title="Staking" />
      </div>
    )
}

Transaction.getLayout = function getLayout(page) {
  return (
    <Layout>{page}</Layout>
  )
}
