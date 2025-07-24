import { useEffect } from "react";

function App() {
  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand(); // Optional, make it full screen
      console.log("Telegram Mini App loaded", tg.initDataUnsafe);
    }
  }, []);

  return (
    <div>
      <h1>Welcome to NWR Vault Mini App</h1>
    </div>
  );
}

export default App;
