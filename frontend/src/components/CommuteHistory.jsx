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
                setHistory(data)
            }
        }
        fetchHistory()
    },[])
}
return (
  <div>
    <h2>Commute History</h2>
    <ul>
      {history.map((item, index) => (
        <li key={index}>
          <span> {item.date}</span> - {item.orgin} ➝ {item.desitnation} -
          <span>₹{item.fare}</span>
        </li>
      ))}
    </ul>
  </div>
);
export default CommuteHistory