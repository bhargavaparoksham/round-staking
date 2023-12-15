import React from "react";
import { useState } from "react";
import StakingModal from "./StakingModal/StakingModal";

export const STARTING_GRANTS_ROUND = 14;

const Rounds = ({
  tx,
  address,
  readContracts,
  writeContracts,
  migrate,
  pending,
  round,
  roundEnded,
  mainnetProvider,
  userSigner,
  targetNetwork,
  roundData,
  handleStakingTransaction,
}) => {
  // Set to visibility of Staking Modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [stakingType, setStakingType] = useState("self");

  return (
    <>
      <div className="flex flex-col items-center justify-center pb-10 mb-10 border-b">
        <div className="flex items-center mb-4 w-1/2">
          <div className="text-lg font-semibold w-1/3">Round Id</div>
          <input type="text" className="border rounded px-2 py-1 text-lg w-2/3" placeholder="Enter Round Id" />
        </div>
        <div className="flex items-center w-1/2 mb-6">
          <div className="text-lg font-semibold w-1/3">Chain Id</div>
          <input type="text" className="border rounded px-1 py-1 text-lg w-2/3" placeholder="Enter Chain Id" />
        </div>
        <button
          className="bg-purple-connectPurple-500 text-white font-bold py-2 px-4 rounded w-1/6 justify-center"
          style={{ backgroundColor: "#6F3FF5", color: "white" }}
        >
          Fetch Data
        </button>
      </div>
      <div className="flex flex-col items-center justify-center pb-10 mb-10 border-b">
        <div className="flex items-center mt-4 mb-4 w-1/2">
          <div className="text-lg font-semibold w-1/3">Total Staked (GTC)</div>
          <div className="border rounded px-2 py-1 text-lg w-2/3">0</div>
        </div>
        <div className="flex items-center mt-4 mb-4 w-1/2">
          <div className="text-lg font-semibold w-1/3">No of Stakers </div>
          <div className="border rounded px-2 py-1 text-lg w-2/3">0</div>
        </div>
        <div className="flex items-center mt-4 mb-4 w-1/2">
          <div className="text-lg font-semibold w-1/3">Your Staked (GTC)</div>
          <div className="border rounded px-2 py-1 text-lg w-2/3">0</div>
        </div>
      </div>

      <StakingModal
        roundData={roundData}
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        stakingType={stakingType}
        readContracts={readContracts}
        writeContracts={writeContracts}
        tx={tx}
        address={address}
        userSigner={userSigner}
        round={round}
        targetNetwork={targetNetwork}
        mainnetProvider={mainnetProvider}
        handleStakingTransaction={handleStakingTransaction}
      />
    </>
  );
};

export default Rounds;
