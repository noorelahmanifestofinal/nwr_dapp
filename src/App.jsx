import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import ABI from "./VaultABI.json";

const CONTRACT_ADDRESS = "0xAa8155FE44F791EAFd06933cA76119D9d62E9DE0";

const userLevelNames = [
  "", "Sprout", "Seedling", "Sower", "Gardener", "Tree Planter",
  "Nurturer", "Grovekeeper", "Trailblazer", "Earth Guardian", "Luminary", "Community Pillar"
];

const daoLevelNames = [
  "", "Initiate", "Curator", "Advisor", "Steward", "Elder",
  "Visionary", "Strategist", "Shaper", "Guardian", "Beacon", "Council Pillar"
];

export default function App() {
  const [contract, setContract] = useState(null);
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState("");
  const [userInput, setUserInput] = useState("");
  const [level, setLevel] = useState("");
  const [status, setStatus] = useState("");
  const [userStats, setUserStats] = useState(null);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const s = provider.getSigner();
        setSigner(s);
        const addr = await s.getAddress();
        setAddress(addr);
        const c = new ethers.Contract(CONTRACT_ADDRESS, ABI, s);
        setContract(c);
      }
    };
    init();
  }, []);

  const endorseUser = async () => {
    if (!contract || !userInput || !level) return;
    try {
      const tx = await contract.endorseUserLevel(userInput, parseInt(level));
      await tx.wait();
      setStatus("✅ User level endorsed!");
    } catch (err) {
      console.error(err);
      setStatus("❌ Error endorsing user level");
    }
  };

  const endorseDao = async () => {
    if (!contract || !userInput || !level) return;
    try {
      const tx = await contract.endorseDaoLevel(userInput, parseInt(level));
      await tx.wait();
      setStatus("✅ DAO level endorsed!");
    } catch (err) {
      console.error(err);
      setStatus("❌ Error endorsing DAO level");
    }
  };

  const fetchStats = async () => {
    if (!contract || !userInput) return;
    try {
      const stats = await contract.getUserStats(userInput);
      setUserStats({
        userLevel: stats[0],
        daoLevel: stats[1],
        given: stats[2].toString(),
        helped: stats[3].toString()
      });
    } catch (err) {
      console.error(err);
      setStatus("❌ Could not fetch stats");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow-lg rounded-xl mt-10">
      <h2 className="text-xl font-bold mb-4 text-center">🌱 Endorse Levels</h2>

      <input
        placeholder="User Address"
        className="w-full p-2 border rounded mb-2"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
      />

      <select
        className="w-full p-2 border rounded mb-2"
        value={level}
        onChange={(e) => setLevel(e.target.value)}
      >
        <option value="">Select Level</option>
        {[...Array(11)].map((_, i) => (
          <option key={i + 1} value={i + 1}>
            {i + 1} – {userLevelNames[i + 1]}
          </option>
        ))}
      </select>

      <div className="flex gap-2">
        <button
          onClick={endorseUser}
          className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          ✅ Endorse User
        </button>
        <button
          onClick={endorseDao}
          className="flex-1 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          🏛 DAO Endorse
        </button>
      </div>

      <div className="mt-4">
        <button
          onClick={fetchStats}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          🔍 View Stats
        </button>
      </div>

      {userStats && (
        <div className="mt-4 text-sm bg-gray-100 p-3 rounded">
          <p><strong>User Level:</strong> {userStats.userLevel} – {userLevelNames[userStats.userLevel]}</p>
          <p><strong>DAO Level:</strong> {userStats.daoLevel} – {daoLevelNames[userStats.daoLevel]}</p>
          <p><strong>Endorsements Given:</strong> {userStats.given}</p>
          <p><strong>People Helped:</strong> {userStats.helped}</p>
        </div>
      )}

      {status && (
        <p className="text-center text-sm text-gray-700 mt-4">{status}</p>
      )}
    </div>
  );
}
