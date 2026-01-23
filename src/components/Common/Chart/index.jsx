import { AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import "./styles.css";
import { useQuery } from "@tanstack/react-query";
import { DashboardAPI } from "../../../api/DashboardAPI";
import CircularProgress from "@mui/material/CircularProgress";

import { ResponsiveContainer } from "recharts";

const EarningsChart = () => {
  const { data: earnings, isFetching } = useQuery({
    queryKey: ["earnings"],
    refetchOnMount: false,
    queryFn: () => DashboardAPI.getEarnings(true),
  });

  if (isFetching) {
    return <CircularProgress size={"20px"} style={{ color: "#0c7a50" }} />;
  }

  return (
    <ResponsiveContainer height="90%" width="100%">
      <AreaChart
        data={earnings?.data?.earnings_per_day_last_7_days}
        margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
      >
        <XAxis dataKey="day_of_week" />
        <YAxis />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="points"
          stroke="#0c7a50"
          strokeWidth={2}
          fill="#ddf1e9"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default EarningsChart;
