import { useRouter } from "next/router";
import NetworkDisplay from "../misc/NetworkDisplay";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import {
  getTransactionStatus,
  getBlockTimestamp,
  unixTimestampToDate,
} from "../../scripts/transactons";

const TransactionStatusRow = (props) => {
  let title = (
    <div className="flex justify-start items-center">
      <div className="w-9 h-9 bg-bg-300 flex items-center justify-center rounded-full">
        <Image src={props.img} width="24" height="24" alt={props.title} />
      </div>
      <div className={"text-textBlue-200 text-xl font-regular px-4"}>
        {props.title}
      </div>
    </div>
  );
  if (props.title === "Pending") {
    title = (
      <div className="flex justify-start items-center">
        <div className="w-9 h-9 bg-bg-300 flex items-center justify-center rounded-full relative">
          <div className="w-[10px] h-[10px] animate-pulse bg-textBlue-200 rounded-full"></div>
        </div>
        <div
          className={
            "text-textBlue-200 text-xl font-regular px-4 animate-pulse"
          }
        >
          {props.title}
        </div>
      </div>
    );
  }
  if (props.title === "Pending" && props.status === "completed") {
    title = (
      <div className="flex justify-start items-center">
        <div className="w-9 h-9 bg-bg-300 flex items-center justify-center rounded-full relative">
          <Image src={"check.svg"} width="24" height="24" alt={props.title} />
        </div>
        <div className={"text-textBlue-200 text-xl font-regular px-4"}>
          Confirmed
        </div>
      </div>
    );
  }

  if (props.title === "Completed" && props.status !== "completed") {
    title = (
      <div className="flex justify-start items-center">
        <div className="w-9 h-9  flex items-center justify-center rounded-full">
          <div className="w-[10px] h-[10px] bg-text-100 rounded-full"></div>
        </div>
        <div className={"text-text-100 text-xl font-regular px-4"}>
          {props.title}
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full justify-between items-center">
      {title}
      <div className="flex ">
        <div className="text-text-100 text-base px-2">{props.date}</div>
        <div className="text-text-200 text-base font-medium">{props.time}</div>
      </div>
    </div>
  );
};
const TransactionSeperator = () => (
  <div className="flex justify-center items-center w-[36px]">
    <div className="w-[2px] h-6 bg-textBlue-200 my-2" />
  </div>
);

const TransactionStatusModal = (props) => {
  const router = useRouter();
  const [tx, setTx] = useState(null);
  const [blockStartTime, setBlockStartTime] = useState(0); // [blockNumber, timestamp
  const [txStatus, setTxStatus] = useState("started");
  const { title, valueIn, networkIn, valueOut, networkOut, txHash } =
    router.query;

  useEffect(() => {
    
    getTransactionStatus(
        txHash || "0xf32673f7e74f0ed5c444f3bac74e268073679c8233e4ef276d4e9b0aa7ea8240"
    )
      .then((res) => {
        setTx(res);
        getBlockTimestamp(res.blockNumber)
          .then((time) => {
            const date = unixTimestampToDate(time);
            setBlockStartTime(date);
            console.log(date);
          })
          .catch((err) => {
            setBlockStartTime("unkown");
          });
      })
      .catch((err) => {
        setTxStatus("error: ", err);
      });
  }, [txHash]);

  useEffect(() => {
    if (tx && txStatus === "started") {
      setTxStatus("pending");
      tx.wait(15)
        .then((success) => {
          setTxStatus("completed");
        })
        .catch((failed) => {
          setTxStatus("Error: ", failed);
        });
    }
  }, [tx, txStatus]);

  console.log(tx, txStatus);
  return (
    <div className={`modal w-[690px] my-12 font-sfpro`}>
      <div className="flex justify-between items-start w-full">
        <div>
          <div className="text-[#101828] font-semibold text-xl">
            {title || "Staking"}
          </div>
        </div>
      </div>

      <div className="w-full flex justify-between items-center mt-2 p-6">
        <div className="flex flex-col items-start justify-evenly w-1/3">
          <div className="text-text-100 text-base">From</div>
          <NetworkDisplay
            img="/ethereum.svg"
            name="Ethereum"
            size="32"
            classes={"mt-2 text-xl max-w-[136px]"}
          />
          <span className={"text-text-300 text-3xl font-regular mt-6"}>
            0.69
          </span>
        </div>
        <div className="flex flex-col items-start justify-evenly w-1/3">
          <div className="text-text-100 text-base">From</div>
          <NetworkDisplay
            img="/ethereum.svg"
            name="Ethereum"
            size="32"
            classes={"mt-2 text-xl max-w-[136px]"}
          />
          <span className={"text-text-300 text-3xl font-regular mt-6"}>
            0.69
          </span>
        </div>
      </div>

      <div className="w-full flex flex-col justify-start items-start mt-2 p-6">
        <div className="text-text-100 text-base">Status</div>
        <div className="flex flex-col items-start justify-evenly w-full mt-6">
          <TransactionStatusRow
            title="Submitted"
            img="/check.svg"
            date={blockStartTime.date}
            time={blockStartTime.time}
          />
          {txStatus === "pending" && <> </>}
          <TransactionSeperator />
          <TransactionStatusRow
            title="Pending"
            status={txStatus}
            img="/chevron.svg"
            date=""
            time={`${tx.confirmations} confirmations` || ""}
          />
          <TransactionSeperator />
          <TransactionStatusRow
            title="Completed"
            status={txStatus}
            img="/check.svg"
            date="--"
            time=""
          />
          {txStatus === "completed" && <></>}
        </div>
      </div>
    </div>
  );
};

export default TransactionStatusModal;
