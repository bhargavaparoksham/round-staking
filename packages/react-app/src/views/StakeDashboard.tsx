import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Navbar } from "../components";
import { useNavigate } from "react-router-dom";

import { formatGtc } from "../components/StakingModal/utils";
import StakingDoneNotificationModal from "../components/StakingModal/StakingDoneNotificationModal";

type StakeDashboardProps = {
  tx: any;
  readContracts: any;
  address: string;
  writeContracts: any;
  mainnetProvider: ethers.providers.Web3Provider;
  networkOptions: any;
  USE_NETWORK_SELECTOR: any;
  localProvider: any;
  targetNetwork: any;
  logoutOfWeb3Modal: any;
  selectedChainId: any;
  localChainId: any;
  NETWORKCHECK: any;
  userSigner: any;
  price: any;
  web3Modal: any;
  loadWeb3Modal: any;
  blockExplorer: any;
};

function StakeDashboard({
  tx,
  readContracts,
  address,
  writeContracts,
  mainnetProvider,
  networkOptions,
  USE_NETWORK_SELECTOR,
  localProvider,
  targetNetwork,
  logoutOfWeb3Modal,
  selectedChainId,
  localChainId,
  NETWORKCHECK,
  userSigner,
  price,
  web3Modal,
  loadWeb3Modal,
  blockExplorer,
}: StakeDashboardProps) {
  const [stakingDoneNotificationModalVisible, setStakingDoneNotificationModalVisible] = useState(false);

  const [totalStaked, setTotalStaked] = useState("0");
  const [totalStakers, setTotalStakers] = useState("0");
  const [myStake, setMyStake] = useState("0");
  const [roundId, setRoundId] = useState("");
  const [chainId, setChainId] = useState("");
  const [stakeAmount, setStakeAmount] = useState("0");
  const [unstakeAmount, setUnstakeAmount] = useState("0");

  const navigate = useNavigate();
  // Route user to dashboard when wallet is connected
  useEffect(() => {
    if (!web3Modal?.cachedProvider) {
      navigate("/");
    }
  }, [web3Modal?.cachedProvider, navigate]);

  // generate round byte = roundId + "-" + chainId
  const toBytes32 = (roundId: string, chainId: string) => {
    //convert chainId to hex
    chainId = ethers.BigNumber.from(chainId).toHexString();

    // Remove '0x' prefix if present
    roundId = roundId.startsWith("0x") ? roundId.slice(2) : roundId;
    chainId = chainId.startsWith("0x") ? chainId.slice(2) : chainId;

    // Hexadecimal ASCII value for '-'
    const dashHex = "2D";

    // Concatenate roundId, dash, and chainId in hex
    let combinedHex = roundId + dashHex + chainId;

    // Pad the result to fit 32 bytes (64 characters)
    combinedHex = combinedHex.padEnd(64, "0");

    // Add '0x' prefix
    return "0x" + combinedHex;
  };

  // fetch data from contract
  async function fetchData(round: string) {
    try {
      // Ensure the 'round' is a valid hex string
      if (!ethers.utils.isHexString(round)) {
        throw new Error("Invalid hex string");
      }

      if (readContracts.RoundStaking) {
        const totalStaked = await readContracts.RoundStaking.roundStakes(round);
        const totalStakers = await readContracts.RoundStaking.uniqueStakerCount(round);
        const myStake = await readContracts.RoundStaking.userStakes(address, round);
        setTotalStaked(formatGtc(totalStaked));
        setTotalStakers(totalStakers.toString());
        setMyStake(formatGtc(myStake));
      }
    } catch (error) {
      console.error("Error fetching total staked:", error);
      throw error;
    }
  }

  const handleStake = async () => {
    try {
      if (!stakeAmount) return;
      const stakeTx = tx(writeContracts.RoundStaking.stake(toBytes32(roundId, chainId), stakeAmount));
      await stakeTx;
      setStakingDoneNotificationModalVisible(true);
    } catch (e: any) {
      console.error("Error staking:", e);
      throw e;
    }
  };

  const handleUnstake = async () => {
    try {
      if (!unstakeAmount) return;
      const unstakeTx = tx(writeContracts.RoundStaking.unstake(toBytes32(roundId, chainId), unstakeAmount));
      await unstakeTx;
    } catch (e: any) {
      console.error("Error unstaking:", e);
      throw e;
    }
  };

  const [activeTab, setActiveTab] = useState("dashboard");

  const getTabClassName = (tabName: string) => {
    return activeTab === tabName ? "p-2 text-lg border-b bg-gray-200" : "p-2 text-lg border-b";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        readContracts={readContracts}
        networkOptions={networkOptions}
        USE_NETWORK_SELECTOR={USE_NETWORK_SELECTOR}
        localProvider={localProvider}
        targetNetwork={targetNetwork}
        logoutOfWeb3Modal={logoutOfWeb3Modal}
        selectedChainId={selectedChainId}
        localChainId={localChainId}
        NETWORKCHECK={NETWORKCHECK}
        userSigner={userSigner}
        mainnetProvider={mainnetProvider}
        price={price}
        web3Modal={web3Modal}
        loadWeb3Modal={loadWeb3Modal}
        blockExplorer={blockExplorer}
      />

      <StakingDoneNotificationModal
        visible={stakingDoneNotificationModalVisible}
        onClose={() => {
          setStakingDoneNotificationModalVisible(false);
        }}
      />
      {/* Grants Round Header */}
      <main className="container flex flex-1 flex-col px-8 md:mx-auto pb-10">
        <div className="mt-8 flex items-center justify-between border-b">
          <div>
            <p className="mb-4 text-3xl text-left">Gitcoin Round Staking</p>
          </div>
        </div>
        <div className="flex flex-1 md:flex-row">
          {/*-- Tabs Section */}
          <aside className="w-1/5 border-r">
            <ul className="flex flex-col">
              <li className={getTabClassName("dashboard")} onClick={() => setActiveTab("dashboard")}>
                Dashboard
              </li>
              <li className={getTabClassName("stake")} onClick={() => setActiveTab("stake")}>
                Stake
              </li>
              <li className={getTabClassName("unstake")} onClick={() => setActiveTab("unstake")}>
                Unstake
              </li>
            </ul>
          </aside>

          {/*-- Content Section */}
          <section className="w-4/5">
            {/*-- Dashboard Content */}
            {activeTab === "dashboard" && (
              <div className="py-2 mt-6 w-full">
                <div className="text-gray-600 body-font w-full">
                  <div className="flex flex-col items-center justify-center pb-10 mb-10 border-b">
                    <div className="flex items-center mb-4 w-1/2">
                      <div className="text-lg font-semibold w-1/3">Round Id</div>
                      <input
                        type="text"
                        className="border rounded px-2 py-1 text-lg w-2/3"
                        placeholder="Enter Round Id"
                        onChange={e => {
                          setRoundId(e.target.value);
                        }}
                      />
                    </div>
                    <div className="flex items-center w-1/2 mb-6">
                      <div className="text-lg font-semibold w-1/3">Chain Id</div>
                      <input
                        type="text"
                        className="border rounded px-1 py-1 text-lg w-2/3"
                        placeholder="Enter Chain Id"
                        onChange={e => {
                          setChainId(e.target.value);
                        }}
                      />
                    </div>
                    <button
                      className="bg-purple-connectPurple-500 text-white font-bold py-2 px-4 rounded w-1/6 justify-center"
                      style={{ backgroundColor: "#6F3FF5", color: "white" }}
                      onClick={() => fetchData(toBytes32(roundId, chainId))}
                    >
                      Fetch Data
                    </button>
                  </div>
                  <div className="flex flex-col items-center justify-center pb-10 mb-10 border-b">
                    <div className="flex items-center mt-4 mb-4 w-1/2">
                      <div className="text-lg font-semibold w-1/3">Total Staked (GTC)</div>
                      <div className="border rounded px-2 py-1 text-lg w-2/3">{totalStaked}</div>
                    </div>
                    <div className="flex items-center mt-4 mb-4 w-1/2">
                      <div className="text-lg font-semibold w-1/3">No of Stakers </div>
                      <div className="border rounded px-2 py-1 text-lg w-2/3">{totalStakers}</div>
                    </div>
                    <div className="flex items-center mt-4 mb-4 w-1/2">
                      <div className="text-lg font-semibold w-1/3">Your Staked (GTC)</div>
                      <div className="border rounded px-2 py-1 text-lg w-2/3">{myStake}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/*-- Stake Content */}
            {activeTab === "stake" && (
              <div className="py-2 mt-6 w-full">
                <div className="text-gray-600 body-font w-full">
                  <div className="flex flex-col items-center justify-center pb-10 mb-10 border-b">
                    <div className="flex items-center mb-4 w-1/2">
                      <div className="text-lg font-semibold w-1/3">Round Id</div>
                      <input
                        type="text"
                        className="border rounded px-2 py-1 text-lg w-2/3"
                        placeholder="Enter Round Id"
                        onChange={e => {
                          setRoundId(e.target.value);
                        }}
                      />
                    </div>
                    <div className="flex items-center w-1/2 mb-6">
                      <div className="text-lg font-semibold w-1/3">Chain Id</div>
                      <input
                        type="text"
                        className="border rounded px-1 py-1 text-lg w-2/3"
                        placeholder="Enter Chain Id"
                        onChange={e => {
                          setChainId(e.target.value);
                        }}
                      />
                    </div>
                    <div className="flex items-center w-1/2 mb-6">
                      <div className="text-lg font-semibold w-1/3">Amount</div>
                      <input
                        type="number"
                        className="border rounded px-1 py-1 text-lg w-2/3"
                        placeholder="Enter Amount"
                        onChange={e => {
                          setStakeAmount(ethers.utils.parseEther(e.target.value).toString());
                        }}
                      />
                    </div>
                    <button
                      className="bg-purple-connectPurple-500 text-white font-bold py-2 px-4 rounded w-1/6 justify-center"
                      style={{ backgroundColor: "#6F3FF5", color: "white" }}
                      onClick={() => {
                        handleStake();
                      }}
                    >
                      Stake
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/*-- Unstake Content */}
            {activeTab === "unstake" && (
              <div className="py-2 mt-6 w-full">
                <div className="text-gray-600 body-font w-full">
                  <div className="flex flex-col items-center justify-center pb-10 mb-10 border-b">
                    <div className="flex items-center mb-4 w-1/2">
                      <div className="text-lg font-semibold w-1/3">Round Id</div>
                      <input
                        type="text"
                        className="border rounded px-2 py-1 text-lg w-2/3"
                        placeholder="Enter Round Id"
                        onChange={e => {
                          setRoundId(e.target.value);
                        }}
                      />
                    </div>
                    <div className="flex items-center w-1/2 mb-6">
                      <div className="text-lg font-semibold w-1/3">Chain Id</div>
                      <input
                        type="text"
                        className="border rounded px-1 py-1 text-lg w-2/3"
                        placeholder="Enter Chain Id"
                        onChange={e => {
                          setChainId(e.target.value);
                        }}
                      />
                    </div>
                    <div className="flex items-center w-1/2 mb-6">
                      <div className="text-lg font-semibold w-1/3">Amount</div>
                      <input
                        type="number"
                        className="border rounded px-1 py-1 text-lg w-2/3"
                        placeholder="Enter Amount"
                        onChange={e => {
                          setUnstakeAmount(ethers.utils.parseEther(e.target.value).toString());
                        }}
                      />
                    </div>
                    <button
                      className="bg-purple-connectPurple-500 text-white font-bold py-2 px-4 rounded w-1/6 justify-center"
                      style={{ backgroundColor: "#6F3FF5", color: "white" }}
                      onClick={() => {
                        handleUnstake();
                      }}
                    >
                      Unstake
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>
          {/* <section className="w-full border-t mr-8 mb-2">
           
          </section> */}
        </div>
      </main>
    </div>
  );
}

export default StakeDashboard;
