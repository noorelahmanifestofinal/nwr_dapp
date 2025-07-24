import { useEffect, useState } from "react";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand(); // Optional: open fullscreen
      const userData = tg.initDataUnsafe?.user;
      setUser(userData);
      console.log("Telegram Mini App loaded", userData);
    }
  }, []);

  return (
    <div>
      <h1>Welcome to NWR Vault Mini App</h1>
      {user && (
        <p>
          Hello <strong>{user.first_name}</strong> 👋<br />
          Your Telegram ID is <code>{user.id}</code>
        </p>
      )}
    </div>
  );
}

export default App;
