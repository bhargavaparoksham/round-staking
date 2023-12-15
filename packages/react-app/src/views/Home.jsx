import React, { useEffect, useContext } from "react";
import { Navbar, AccountHomePage } from "../components";
import { useNavigate } from "react-router-dom";

import { Web3Context } from "../helpers/Web3Context";

function Home({
  tx,
  readContracts,
  writeContracts,
  mainnetProvider,
  selectedNetwork,
  setSelectedNetwork,
  yourLocalBalance,
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
  networkOptions,
}) {
  const navigate = useNavigate();
  const { address } = useContext(Web3Context);

  // Route user to dashboard when wallet is connected
  useEffect(() => {
    async function loadDashboard() {
      if (userSigner) {
        navigate("/StakeDashboard");
      }
    }
    loadDashboard();
  }, [userSigner, web3Modal?.cachedProvider, navigate]);

  return (
    <div className="min-h-max min-h-default bg-landingPageBackground bg-cover bg-no-repeat text-gray-100 md:bg-center">
      <Navbar
        networkOptions={networkOptions}
        selectedNetwork={selectedNetwork}
        setSelectedNetwork={setSelectedNetwork}
        yourLocalBalance={yourLocalBalance}
        USE_NETWORK_SELECTOR={USE_NETWORK_SELECTOR}
        localProvider={localProvider}
        address={address}
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
      <div className="container mx-auto px-5 py-2">
        <div className="mx-auto flex flex-wrap">
          <div className="mt-0 md:ml-4 w-full pb-6 text-white sm:mt-40 sm:w-1/2 md:mt-40 md:w-1/2 md:pt-6">
            <div className="leading-relaxed">
              <p className="text-2xl sm:text-xl md:text-xl text-black text-left">Round Staking</p>
              <p className="text-2xl sm:text-3xl md:text-3xl text-black text-left">
                Promote your favourite round by staking on it
              </p>
            </div>
            <div className="text-left mt-0 text-lg text-gray-900 sm:text-xl md:mt-10 md:pr-20 md:text-xl">
              Stake GTC to show the rounds you like on top of the Grants Stack Explorer home page. The more GTC you
              stake, the higher the round will be ranked.
            </div>
            <div className="mt-4 w-full sm:mt-10 sm:w-1/2 md:mt-10 md:block md:w-1/2">
              <AccountHomePage
                web3Modal={web3Modal}
                loadWeb3Modal={loadWeb3Modal}
                logoutOfWeb3Modal={logoutOfWeb3Modal}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
