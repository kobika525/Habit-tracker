import { useContext, useEffect, useState } from "react";
import API from "../api/api";
import ProgressChart from "../components/ProgressChart";
import { AuthContext } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [logs, setLogs] = useState([]);
  const [streak, setStreak] = useState(0);
  const [completionRate, setCompletionRate] = useState(0);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      return;
    }
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await API.get("/logs");
      const logsData = res.data;

      setLogs(logsData);
      calculateStats(logsData);
    } catch (error) {
      console.error(error);
    }
  };

  const calculateStats = (logsData) => {
    const dates = logsData.map((log) => log.date);
    const uniqueDates = [...new Set(dates)].sort().reverse();

    // streak calculation
    let currentStreak = 0;
    const today = new Date();

    for (let i = 0; i < uniqueDates.length; i++) {
      const d = new Date(uniqueDates[i]);
      const diff = Math.floor((today - d) / (1000 * 60 * 60 * 24));

      if (diff === currentStreak) {
        currentStreak++;
      } else {
        break;
      }
    }
    setStreak(currentStreak);

    // completion rate (over the last 30 days)
    const totalDays = 30;
    const completion = (uniqueDates.length / totalDays) * 100;
    setCompletionRate(completion.toFixed(1));
  };

  // chart data, oldest first so the line reads left-to-right
  const chartData = [...logs]
    .sort((a, b) => (a.date > b.date ? 1 : -1))
    .map((log) => ({
      date: log.date,
      count: 1,
    }));

  if (!localStorage.getItem("token")) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-gray-900 px-4 text-center">
        Please login to view dashboard
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 sm:px-6 lg:px-8 py-6">
      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">
        {user ? `Welcome back, ${user.name}` : "Dashboard"}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* Streak */}
        <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow">
          <h2 className="text-gray-400 text-sm sm:text-base">
            Current Streak
          </h2>
          <p className="text-xl sm:text-2xl font-bold text-green-400">
            {streak} days
          </p>
        </div>

        {/* Completion Rate */}
        <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow">
          <h2 className="text-gray-400 text-sm sm:text-base">
            Completion Rate
          </h2>
          <p className="text-xl sm:text-2xl font-bold text-blue-400">
            {completionRate}%
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow">
        <h2 className="mb-4 font-semibold text-base sm:text-lg">
          Progress Chart
        </h2>

        {chartData.length > 0 ? (
          <div className="w-full overflow-x-auto">
            <ProgressChart data={chartData} />
          </div>
        ) : (
          <p className="text-gray-400 text-sm">
            No completions logged yet. Mark a habit complete to see your
            progress here.
          </p>
        )}
      </div>
    </div>
  );
}
