import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";

export default function App() {
  const [provider, setProvider] = useState(null);
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState("");
  const [network, setNetwork] = useState("");

  const connectWallet = async () => {
    try {
      const web3Modal = new Web3Modal({
        cacheProvider: true,
        providerOptions: {},
      });
      const instance = await web3Modal.connect();
      const web3Provider = new ethers.providers.Web3Provider(instance);

      const signer = web3Provider.getSigner();
      const userAddress = await signer.getAddress();
      const userBalance = await web3Provider.getBalance(userAddress);
      const networkInfo = await web3Provider.getNetwork();

      setProvider(web3Provider);
      setAddress(userAddress);
      setBalance(ethers.utils.formatEther(userBalance));
      setNetwork(networkInfo.name);

      // Auto switch based on contract chain
      if (networkInfo.chainId === 137) {
        console.log("Using Polygon (p)");
      } else if (networkInfo.chainId === 56) {
        console.log("Using Binance Smart Chain (bsc)");
      }
    } catch (error) {
      console.error("Connection failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      <h1 className="text-4xl font-bold mb-4">NWR dApp Portal 🌕</h1>
      <p className="mb-4">
        <strong>Status:</strong> {address ? "Connected" : "Disconnected"}
      </p>
      {address && (
        <div className="text-sm text-center mb-4">
          <p><strong>Wallet:</strong> {address.slice(0, 6)}...{address.slice(-4)}</p>
          <p><strong>Balance:</strong> {balance} ETH</p>
          <p><strong>Network:</strong> {network}</p>
        </div>
      )}
      <button
        onClick={connectWallet}
        className="bg-white text-black font-semibold px-4 py-2 rounded hover:bg-gray-200"
      >
        {address ? "Connected" : "Connect Wallet"}
      </button>
    </div>
  );
}
