import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";

// SafePal injects `window.safepalProvider`
const detectSafePal = () => {
  if (typeof window !== "undefined" && window.safepalProvider) {
    return window.safepalProvider;
  }
  return null;
};

export default function App() {
  const [provider, setProvider] = useState(null);
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState("");
  const [network, setNetwork] = useState("");
  const [status, setStatus] = useState("No wallet detected ❌");

  const connectWallet = async () => {
    try {
      let instance;

      // 1. Try SafePal if injected
      const safePalProvider = detectSafePal();
      if (safePalProvider) {
        instance = safePalProvider;
      } else {
        // 2. Use Web3Modal for MetaMask, Coinbase, Bitget, WalletConnect
        const web3Modal = new Web3Modal({
          cacheProvider: false,
          providerOptions: {
            walletconnect: {
              package: WalletConnectProvider,
              options: {
                rpc: {
                  56: "https://bsc-dataseed.binance.org",
                  137: "https://polygon-rpc.com",
                },
              },
            },
            coinbasewallet: {
              package: CoinbaseWalletSDK,
              options: {
                appName: "NWR dApp",
                rpc: "https://polygon-rpc.com", // default fallback
              },
            },
            injected: {
              display: {
                name: "Browser Wallet",
                description: "MetaMask, Bitget, Brave, etc.",
              },
              package: null,
            },
          },
        });

        instance = await web3Modal.connect();
      }

      const web3Provider = new ethers.providers.Web3Provider(instance);
      const signer = web3Provider.getSigner();
      const userAddress = await signer.getAddress();
      const userBalance = await web3Provider.getBalance(userAddress);
      const networkInfo = await web3Provider.getNetwork();

      setProvider(web3Provider);
      setAddress(userAddress);
      setBalance(ethers.utils.formatEther(userBalance));
      setNetwork(networkInfo.name);
      setStatus("✅ Connected");

      if (networkInfo.chainId === 137) {
        console.log("Using Polygon (P)");
      } else if (networkInfo.chainId === 56) {
        console.log("Using Binance Smart Chain (BSC)");
      } else {
        console.warn("Unsupported network:", networkInfo.chainId);
      }
    } catch (err) {
      console.error("Wallet connection failed:", err);
      setStatus("❌ Connection failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      <h1 className="text-4xl font-bold mb-4 text-center">NWR dApp<br />Portal 🌕</h1>
      <p className="mb-4 text-lg">
        <strong>Status:</strong> {status}
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
        className="bg-white text-black font-semibold px-4 py-2 rounded hover:bg-gray-200 transition"
      >
        {address ? "Wallet Connected ✅" : "Connect Wallet"}
      </button>
    </div>
  );
}
