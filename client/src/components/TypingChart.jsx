import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const TypingChart = ({ rawWPM, actualWPM, accuracy }) => {
  const data = [
    {
      name: "Raw WPM",
      value: rawWPM,
    },
    {
      name: "Actual WPM",
      value: actualWPM,
    },
    {
      name: "Accuracy",
      value: accuracy,
    },
  ];

  return (
    <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-3 text-center text-primary">
        📊 Typing Performance Graph
      </h2>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" stroke="#8884d8" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#4f46e5" barSize={40} radius={[5, 5, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TypingChart;
