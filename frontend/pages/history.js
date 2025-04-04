import { useState, useEffect } from "react";

const History = () => {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to view history.");
        return;
      }
      try {
        const res = await fetch("http://localhost:5000/api/commute/history", {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Error fetching history");
        } else {
          setHistory(data);
        }
      } catch (err) {
        setError("An error occurred while fetching history.");
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="container main-content">
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>
        Your Commute History
      </h1>
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      {history.length === 0 && !error && (
        <p style={{ textAlign: "center" }}>No commute records found.</p>
      )}
      <div style={{ display: "grid", gap: "1.5rem" }}>
        {history.map((commute) => (
          <div key={commute._id} className="card">
            <p>
              <strong>From:</strong> {commute.start} <strong>To:</strong>{" "}
              {commute.destination}
            </p>
            <p>
              <strong>Distance:</strong> {commute.distance} meters,{" "}
              <strong>Duration:</strong> {commute.duration} seconds
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(commute.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
