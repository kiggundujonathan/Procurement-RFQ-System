import { createContext, useState, useEffect } from "react";

export const RequestContext = createContext();

export const RequestProvider = ({ children }) => {
  
const [requests, setRequests] = useState(() => {
  const saved = localStorage.getItem("requests");
  return saved ? JSON.parse(saved) : [];
});

useEffect(() => {
  localStorage.setItem("requests", JSON.stringify(requests));
}, [requests]);

  //  ADD USER HERE
  const [user, setUser] = useState({
    name: "Jonathan",
    role: "Procurement" // change this to test(Requestor,Finance,Supervisor,Procurement)
  });

  return (
    <RequestContext.Provider value={{ requests, setRequests, user, setUser }}>
      {children}
    </RequestContext.Provider>
  );
};