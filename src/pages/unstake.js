import React from "react"
import Layout from "../components/layout"
import UnstakeModal from "../components/modals/UnStakeModal"
export default function Stake() {
    return (
        <div className="w-full flex flex-col items-center">
            <UnstakeModal example="stake" />
        </div>
    )
}

Stake.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>
}
