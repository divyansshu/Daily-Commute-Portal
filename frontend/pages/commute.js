import { useState } from "react";

const Commute = () => {
  const [start, setStart] = useState("");
  const [destination, setDestination] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handlePlanCommute = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to plan a commute.");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/api/commute/route", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify({ start, destination }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error planning commute");
      } else {
        setResult(data);
      }
    } catch (err) {
      setError("An error occurred while planning your commute.");
    }
  };

  return (
    <div className="form-container">
      <h1>Plan Your Commute</h1>
      <form onSubmit={handlePlanCommute}>
        <label>Start Location:</label>
        <input
          type="text"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          placeholder="e.g., Times Square, New York, NY"
          required
        />
        <label>Destination:</label>
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="e.g., Central Park, New York, NY"
          required
        />
        <button type="submit">Plan Commute</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {result && (
        <div className="card">
          <h2>Commute Details</h2>
          <p>
            <strong>Distance:</strong> {result.distance} meters
          </p>
          <p>
            <strong>Duration (with traffic):</strong> {result.duration} seconds
          </p>
          <p>
            <strong>Estimated Fare:</strong> ${result.fare}
          </p>
          <p>
            <strong>Commute ID:</strong> {result.commuteId}
          </p>
        </div>
      )}
    </div>
  );
};

export default Commute;
