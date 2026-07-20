import { createContext, useState, useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export const RequestContext = createContext();

export const RequestProvider = ({ children }) => {
  const [requests, setRequests] = useState(() => {
    const saved = localStorage.getItem("requests");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(
      "requests",
      JSON.stringify(requests)
    );
  }, [requests]);

  const { user } = useContext(AuthContext);

  return (
    <RequestContext.Provider
      value={{
        requests,
        setRequests,
        user,
      }}
    >
      {children}
    </RequestContext.Provider>
  );
};
