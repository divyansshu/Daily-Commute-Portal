import { useEffect, useState } from "react";
import { getCommuteHistory } from "../services/commute";
import { getToken } from "../services/auth";

const CommuteHistory = () => {
    const [history, setHistory] = useState([])

    useEffect(() => {
        const fetchHistory = async () => {
            const token = getToken()
            if(token) {
                const data = await getCommuteHistory(token)
                setHistory(Array.isArray(data) ? data : [])
            }
        }
        fetchHistory()
    },[])

return (
  <div>
    <h2>Commute History</h2>
    <ul>
      {history.length > 0 ? (
        history.map((item, index) => (
          <li key={index}>
            <span>{item.date}</span> - {item.origin} ➝ {item.destination} -
            <span>₹{item.fare}</span>
          </li>
        ))
      ) : (
        <li>No commute history available.</li> // Fallback message
      )}
    </ul>
  </div>
);
}
export default CommuteHistory