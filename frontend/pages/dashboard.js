import { useState, useEffect } from "react";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to view the dashboard.");
        return;
      }
      try {
        const res = await fetch("http://localhost:5000/api/commute/dashboard", {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Error fetching dashboard data");
        } else {
          setStats(data);
        }
      } catch (err) {
        setError("An error occurred while fetching dashboard data.");
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="container main-content">
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>Dashboard</h1>
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      {stats && (
        <div className="card" style={{ maxWidth: "400px", margin: "0 auto" }}>
          <p>
            <strong>Total Commutes:</strong> {stats.totalCommutes}
          </p>
          <p>
            <strong>Total Distance:</strong> {stats.totalDistance} meters
          </p>
          <p>
            <strong>Average Duration:</strong> {stats.avgDuration} seconds
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
