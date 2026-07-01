import { Link } from "react-router-dom";
import { useContext } from "react";
import { RequestContext } from "../../context/RequestContext";


export default function Layout({ children }) {

const { user } = useContext(RequestContext);
  

  return (
    <div style={{ display: "flex", height: "100vh" }}>

      {/* Sidebar */}
      <div style={{
        width: "220px",
        backgroundColor: "#2c3e50",
        color: "white",
        padding: "20px"
      }}>
        <h2>RFQ System</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "20px" }}>
 <Link to="/" style={{ color: "white", textDecoration: "none" }}>
  Dashboard
</Link>

<Link to="/gor" style={{ color: "white", textDecoration: "none" }}>
  Create Request
</Link>

<Link to="/my-requests" style={{ color: "white", textDecoration: "none" }}>
  My Requests
</Link>

{user && user.role === "Finance" && (
  <Link to="/finance" style={{ color: "white", textDecoration: "none" }}>
    Finance Review
  </Link>
)}

{user && user.role === "Supervisor" && (
  <Link to="/supervisor" style={{ color: "white", textDecoration: "none" }}>
    Supervisor Review
  </Link>
)}

{user && user.role === "Procurement" && (
  <Link to="/procurement" style={{ color: "white", textDecoration: "none" }}>
    Procurement
  </Link>
)}

        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "20px" }}>
        {children}
      </div>

    </div>
  );
}