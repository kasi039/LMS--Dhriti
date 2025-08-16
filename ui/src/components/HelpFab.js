import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../css/HelpPage.css'; 

export default function HelpFab() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users/session-user", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Not logged in");
        const data = await res.json();
        setUser(data.user);
      } catch {
        setUser(null);
      }
    })();
  }, []);

  const goHelp = () => {
    if (user) navigate("/help");
    else navigate("/Auth");
  };

  return (
    <button className="help-fab" onClick={goHelp} aria-label="Open Help">
      ❓
    </button>
  );
}
