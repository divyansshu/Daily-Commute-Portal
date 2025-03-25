import { useEffect, useState } from "react"
import { getCurrentLocation } from "../services/commute"
import DashboardCard from "../components/DashboardCard"
import CommuteHistory from "../components/CommuteHistory"
import {FaMapMarkerAlt, FaRoute, FaClock, FaRupeeSign} from 'react-icons/fa'

const Dashboard = () => {
    const [location, setLocation] = useState({city: '', country: ''})
    const [stats, setStats] = useState({
      distance: "0 km",
      time: "0 min",
      fare: "0 ₹",
    });

    useEffect(() => {
        //get real time location
        navigator.geolocation.getCurrentPosition(async (position) => {
            const {latitude, longitude} = position.coords
            const data = await getCurrentLocation(latitude, longitude)

            const city = data.features[0]?.properties?.city || 'unKnown'
            const country = data.features[0]?.properties?.country || 'Unknown'

            setLocation({city, country})

            //example stats (replace with real data later)
            setStats({
              distance: "12 Km",
              time: "30 min",
              fare: "150 ₹",
            });
        })
    }, [])
    return (
      <div>
        <h1>Dashboard</h1>
        <div>
          <DashboardCard
            title="current Location"
            value={`${location.city}, ${location.country}`}
            icon={<FaMapMarkerAlt />}
          />
          <DashboardCard
            title="Total distance"
            value={stats.distance}
            icon={<FaRoute />}
          />
          <DashboardCard
            title="Total Fare"
            value={stats.fare}
            icon={<FaRupeeSign />}
          />
        </div>
        <CommuteHistory/>
      </div>
    );
}

export default Dashboard