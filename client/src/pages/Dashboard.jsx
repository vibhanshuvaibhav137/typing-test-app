import { useEffect, useState, useContext } from "react";
import api from "../utils/api.js";
import { AuthContext } from "../context/AuthContext.jsx";

const Dashboard = () => {
  const [results, setResults] = useState([]);
  const { user } = useContext(AuthContext);

  const fetchUserResults = async () => {
    try {
      const res = await api.get("/typing/user", {
        headers: {
          Authorization: `Bearer ${user?.token}`, // Auth header
        },
      });
      setResults(res.data);
    } catch (err) {
      console.error("Error fetching dashboard data:", err.response?.data?.msg || err.message);
    }
  };

  useEffect(() => {
    fetchUserResults();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10 bg-white dark:bg-gray-800 rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center text-primary">📊 Typing Test History</h2>
      {results.length === 0 ? (
        <p className="text-center">No results found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm table-auto border">
            <thead className="bg-gray-200 dark:bg-gray-700">
              <tr>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Raw WPM</th>
                <th className="p-2 border">Actual WPM</th>
                <th className="p-2 border">Accuracy</th>
                <th className="p-2 border">Duration</th>
              </tr>
            </thead>
            <tbody>
              {results.map((res, idx) => (
                <tr key={idx} className="text-center border-b dark:border-gray-600">
                  <td className="p-2">{new Date(res.createdAt).toLocaleString()}</td>
                  <td className="p-2">{res.rawWPM}</td>
                  <td className="p-2">{res.actualWPM}</td>
                  <td className="p-2">{res.accuracy}%</td>
                  <td className="p-2">{res.duration}s</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
