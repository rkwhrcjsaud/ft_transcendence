import { useState } from "react";
import { Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useAuth } from "../hooks/useAuth";

export default function AuthProvider() {
  const user = useState(useAuth());

  return (
      <AuthContext.Provider value={user[0]}>
          <Outlet></Outlet>
      </AuthContext.Provider>
  );
};

