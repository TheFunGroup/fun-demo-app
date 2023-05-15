import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useFun } from "../../contexts/funContext";
import PaymentMethod from "../forms/PaymentMethod";
import StakeForm from "../forms/StakeForm";
import { calculateGas } from "../../scripts/calculateGas";
import { networks } from "../../utils/networks";
import Spinner from "../misc/Spinner";

const examples = {
  stake: {
    title: "Stake",
    description: "Stake to earn rewards. Longer staking earn more rewards.",
    submit: "stake",
  },
};


// some requirements for staking 
// must verify the user is on the correct chain. support chain 1 and 5 ONLY
// must verify that the user has enough funds to pay for the gas given they are paying

export default function StakingModal(props) {
  const router = useRouter();
  const example = examples[props.example];

  const {
    wallet,
    setLoading,
    paymentToken,
    setPaymentToken,
    network,
    setNetwork
  } = useFun();

  const [mustFund, setMustFund] = useState(false);
  const [mustApprove, setMustApprove] = useState(false);

  const [stakeInput, setStakeInput] = useState(0.01);
  const [gas, setGas] = useState("Calculating...");
  const [submitReady, setSubmitReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState();

  async function handleSubmit() {
    if (network !== 1) {
      setError("Please connect to the Ethereum Mainnet.");
      return;
    }
    if (submitting) return;
    setSubmitting(true);
    setLoading(true);
    
  }

  useEffect(() => {
    setMustFund(false);
    setMustApprove(false);
  }, [paymentToken]);

  useEffect(() => {
    if (props.example == "stake") {
      if (paymentToken !== "gasless") {
        calculateGas(
          paymentToken,
          wallet,
          {
            token1: "eth",
            amount: stakeInput,
            
          },
          null
        ).then((gas) => {
          setGas(`${gas.token} ${paymentToken} · $${gas.usd}`);
        });
      } else {
        setGas(`$0.00`);
      }
      if (stakeInput > 0) {
        setSubmitReady(true);
      } else {
        setSubmitReady(false);
      }
    }
  }, [paymentToken, props.example, stakeInput, wallet]);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div className={`modal w-[690px] my-12 font-sfpro`}>
      {mustFund && (
        <div className="alert w-full flex justify-between -mb-[80px] relative">
          <div className="flex items-center">
            <Image src="/alert.svg" width="24" height="24" alt="" />
            <div className="text-[#101828] font-medium ml-3">{`Insufficient ${paymentToken} for transaction fees.`}</div>
          </div>
          <div
            className="button text-center px-[18px] py-[10px]"
            onClick={() => router.push(`/fund?example=${props.example}`)}
          >
            Fund
          </div>
        </div>
      )}

      {mustApprove && (
        <div className="alert w-full flex justify-between -mb-[80px] relative">
          <div className="flex items-center">
            <Image src="/alert.svg" width="24" height="24" alt="" />
            <div className="text-[#101828] font-medium ml-3">{`Token Sponsor doesn’t have the required authorization amount.`}</div>
          </div>
          <div
            className="button text-center px-[18px] py-[10px]"
            onClick={() => router.push(`/approve?example=${props.example}`)}
          >
            Give
          </div>
        </div>
      )}

      {error && (
        <div className="alert w-full flex justify-between -mb-[80px] relative">
          <div className="flex">
            <Image
              src="/alert.svg"
              width="24"
              height="24"
              alt=""
              className="max-h-[24px]"
            />
            <div className="text-[#101828] font-medium ml-3">{error}</div>
          </div>
          <Image
            src="/close.svg"
            width="24"
            height="24"
            alt=""
            className="max-h-[24px] cursor-pointer hover:opacity-75"
            onClick={() => setError(null)}
          />
        </div>
      )}
      <div className="flex justify-between items-start w-full">
        <div><div className="text-[#101828] font-semibold text-xl">
        {example.title}
      </div>
      <div className="text-[#667085] text-sm mt-1 mb-10 whitespace-nowrap">
        {example.description}
      </div></div>
      <div className="flex items-start"> {networks[network]?.name}</div>
      </div>
      

      <div className="rounded-lg border-[1px] border-[#E5E5E5] w-full mt-1 mb-10">
        <div className="flex justify-between items-center w-full p-3">
          <div className="flex items-start">
            <Image
              src="/alert-grey.svg"
              width="16"
              height="16"
              alt="Warning"
              className="mt-1 mx-2"
            />
            <div className="flex flex-col justify-start ml-1">
              <div className="text-[#101828] font-medium text-base">
                Use Swap
              </div>
              <div className="text-xs text-[#667085]">
                {" "}
                At the current rate of stETH, 0.9553, it would be more
                profitable to stake than to swap. Considering swapping?
              </div>
            </div>
          </div>
          <div
            className="flex items-center border-[1px] border-[#E5E5E5] rounded-lg px-5 py-3 text-[#667085] text-sm hover:bg-[#E5E5E5] cursor-pointer font-sfpro"
            onClick={() => {
              // q: "how to recive query objects in nextjs?"
              // a: "use router.query"


              router.push("/swap", { stake: stakeInput } );
            }}
          >
            Swap
          </div>
        </div>
      </div>
      <StakeForm
        setStakeInput={setStakeInput}
        stakeInput={stakeInput}
      />

      <PaymentMethod token={paymentToken} setToken={setPaymentToken} />

      <div className="flex flex-col mt-10 w-full justify-start">
        <div className="font-semibold text-base">Transaction Details</div>
        <div className="flex justify-between w-full  text-sm mt-3">
          <div className="text-[#344054] font-medium">Staking APY</div>
          <div className="text-[#667085]">{`5.4%`}</div>
        </div>
        <div className="flex justify-between w-full mt-1 text-sm">
          <div className="text-[#344054] font-medium">Gas</div>
          <div className="text-[#667085]">{`${gas}`}</div>
        </div>
      </div>

      <div className="flex w-full items-center justify-between mt-10 text-center">
        <div
          className="w-[315px] button p-3 font-medium text-[#344054]"
          onClick={() => router.push("/")}
        >
          Cancel
        </div>
        <div
          className="w-[315px] button-dark p-3 font-medium flex items-center justify-center"
          onClick={handleSubmit}
          style={
            !submitReady || submitting
              ? { opacity: 0.8, pointerEvents: "none" }
              : {}
          }
        >
          <div className={submitting ? "mr-2" : ""}>
            {examples[props.example].submit}
          </div>
          {submitting && <Spinner />}
        </div>
      </div>
    </div>
  );
}
