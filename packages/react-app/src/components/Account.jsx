import React, { useContext, useState } from "react";
import { useThemeSwitcher } from "react-css-theme-switcher";
import { Menu, Dropdown, Space, Drawer } from "antd";
import { DownOutlined, LogoutOutlined } from "@ant-design/icons";
import AddressDropDown from "./AddressDropDown";
import NetworkDisplay from "./NetworkDisplay";

import { Web3Context } from "../helpers/Web3Context";

export default function Account({
  address,
  userSigner,
  localProvider,
  mainnetProvider,
  price,
  minimized,
  web3Modal,
  loadWeb3Modal,
  logoutOfWeb3Modal,
  blockExplorer,
  isContract,
  readContracts,
  networkDisplay,
  NETWORKCHECK,
  localChainId,
  selectedChainId,
  targetNetwork,
  USE_NETWORK_SELECTOR,
  selectedNetwork,
  setSelectedNetwork,
  networkOptions,
}) {
  const { currentNetwork } = useContext(Web3Context);
  const [openNavDrawer, setOpenNavDrawer] = useState(false);
  let accountButtonInfo;
  if (web3Modal?.cachedProvider) {
    accountButtonInfo = { name: "Logout", action: logoutOfWeb3Modal };
  } else {
    accountButtonInfo = { name: "Connect Wallet", action: loadWeb3Modal };
  }

  const menu = (
    <Menu>
      <Menu.ItemGroup key="2">
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a key="logoutbutton" size="medium" style={{ color: "red" }} onClick={logoutOfWeb3Modal}>
          <LogoutOutlined style={{ color: "red" }} />
          {` Logout`}
        </a>
      </Menu.ItemGroup>
    </Menu>
  );

  const addressComponent = (
    <Space>
      <AddressDropDown address={address} ensProvider={mainnetProvider} blockExplorer={blockExplorer} blockieSize={10} />
      <div className="inline-flex">
        <DownOutlined className="inline-flex" />
      </div>
    </Space>
  );

  return (
    <div className="flex">
      {!web3Modal?.cachedProvider && (
        <button className="rounded-sm bg-purple-connectPurple py-4 px-10 text-white" onClick={accountButtonInfo.action}>
          {accountButtonInfo.name}
        </button>
      )}
      {web3Modal?.cachedProvider && (
        <>
          <div className="flex items-center text-base justify-center">
            <>
              <div className="hidden md:inline-flex">
                <span className="mr-5 hover:text-gray-900 capitalize flex flex-row">
                  {" "}
                  <img className="mr-2 h-5" src={"./ethDiamondBlackIcon.svg"} alt="eth icon" />{" "}
                  <span className="text-black">{currentNetwork?.name}</span>
                </span>
              </div>
              <div>
                <NetworkDisplay
                  NETWORKCHECK={NETWORKCHECK}
                  localChainId={localChainId}
                  selectedChainId={selectedChainId}
                  targetNetwork={targetNetwork}
                  USE_NETWORK_SELECTOR={USE_NETWORK_SELECTOR}
                />
              </div>
            </>
            <div className="md:hidden inline-flex">
              <div
                onClick={e => {
                  e.preventDefault();

                  console.log("Open sidebar");

                  setOpenNavDrawer(true);
                }}
              >
                {addressComponent}
              </div>
              <Drawer
                title={null}
                placement="right"
                width="70%"
                closable={false}
                onClose={() => setOpenNavDrawer(false)}
                visible={openNavDrawer}
              >
                <div className="flex flex-1 flex-col items-center mt-8 justify-center">
                  <div className="mb-10">
                    <AddressDropDown
                      address={address}
                      ensProvider={mainnetProvider}
                      blockExplorer={blockExplorer}
                      blockieSize={10}
                    />
                  </div>
                  <div className="mt-4">
                    <a
                      href="/"
                      onClick={e => {
                        e.preventDefault();

                        logoutOfWeb3Modal();
                      }}
                      className="text-signout"
                    >
                      Sign Out
                    </a>
                  </div>
                </div>
              </Drawer>
            </div>
            <div className="hidden md:inline-flex">
              <Dropdown overlay={menu} icon={<DownOutlined />} trigger={["click"]}>
                {addressComponent}
              </Dropdown>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
