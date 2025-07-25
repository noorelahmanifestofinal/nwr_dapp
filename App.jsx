// components/TelegramFallbackConnect.jsx
import { useEffect, useState } from "react";

export default function TelegramFallbackConnect() {
  const [isTelegram, setIsTelegram] = useState(false);

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      setIsTelegram(true);
    }
  }, []);

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-4 text-center">Wallet Connect 🔐</h1>
      {isTelegram ? (
        <>
          <p className="mb-4 text-center">
            🚫 Telegram WebView cannot connect wallets directly.
            <br />
            Please open this dApp in your browser instead.
          </p>
          <a
            href="https://nwr.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-black px-6 py-2 rounded shadow hover:bg-gray-200"
          >
            Open in Browser
          </a>
        </>
      ) : (
        <p className="text-green-400">✅ Not in Telegram, wallet connect is supported here.</p>
      )}
    </div>
  );
}
