import { useContext } from "react";
import AuthContext from "src/context/AuthProvider";

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context)
    throw new Error("useAuth hook deve essere usato all'interno di AuthProvider");

  return context;
};