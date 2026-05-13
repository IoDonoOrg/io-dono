import { Box, Grid, Stack } from "@mui/material";
import { BarChart, LineChart, PieChart } from "@mui/x-charts";
import StatCard from "./StatCard";
import DashboardCard from "./DashboardCard";

const DONATION_BY_CATEGORY = [
  { label: "Abbigliamento", value: 42 },
  { label: "Cibo", value: 78 },
  { label: "Mobili", value: 19 },
  { label: "Elettronica", value: 31 },
  { label: "Giocattoli", value: 24 },
];

const REPORT_BY_STATUS = [
  { id: 0, label: "Aperta", value: 14 },
  { id: 1, label: "In revisione", value: 9 },
  { id: 2, label: "Chiusa", value: 37 },
];

const USERS_BY_ROLE = [
  { id: 0, label: "Admin", value: 4 },
  { id: 1, label: "Associazione", value: 18 },
  { id: 2, label: "Utente", value: 134 },
];

const TREND = [
  { date: "13/04", count: 5 },
  { date: "14/04", count: 8 },
  { date: "15/04", count: 6 },
  { date: "16/04", count: 11 },
  { date: "17/04", count: 14 },
  { date: "18/04", count: 9 },
  { date: "19/04", count: 7 },
  { date: "20/04", count: 13 },
  { date: "21/04", count: 17 },
  { date: "22/04", count: 12 },
  { date: "23/04", count: 10 },
  { date: "24/04", count: 15 },
  { date: "25/04", count: 21 },
  { date: "26/04", count: 18 },
  { date: "27/04", count: 16 },
];

// const fetchOverviewData = async () => {
//   const result = getStatisticsOverview();
//   console.log(result);
// };

// const fetchTrendData = async () => {
//   const result = getStatisticsTrend();
//   console.log(result);
// };

export default function AdminStatistics() {
  // fetchOverviewData();
  // fetchTrendData();
  return (
    <Stack spacing={1.5}>
      <Box>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          <StatCard
            label="Donazioni totali"
            value={194}
            sub={`Ultimi 30 giorni`}
          />
          <StatCard
            label="Segnalazioni totali"
            value={60}
            sub="Relative all'app e donazioni"
          />
          <StatCard
            label="Utenti registrati"
            value={156}
            sub="Donatori, Associazioni, Admin"
          />
        </Stack>
      </Box>

      <DashboardCard title="Trend donazioni (ultimi 30 giorni)">
        <LineChart
          xAxis={[
            {
              scaleType: "point",
              data: TREND.map((d) => d.date),
            },
          ]}
          series={[
            {
              data: TREND.map((d) => d.count),
              area: true,
              curve: "linear",
            },
          ]}
          height={140}
          grid={{ horizontal: true, vertical: true }}
        />
      </DashboardCard>
      <Grid container spacing={1}>
        {/* BarChart occupies the majority (8 out of 12 columns) */}
        <Grid item size={6}>
          <DashboardCard title="Donazioni per categoria">
            <BarChart
              xAxis={[
                {
                  scaleType: "band",
                  data: DONATION_BY_CATEGORY.map((d) => d.label),
                },
              ]}
              yAxis={[{ scaleType: "linear" }]}
              series={[
                {
                  data: DONATION_BY_CATEGORY.map((d) => d.value),
                },
              ]}
              height={200}
              grid={{ horizontal: true }}
            />
          </DashboardCard>
        </Grid>

        <Grid item size={3}>
          <DashboardCard title="Segnalazioni per stato">
            <PieChart
              series={[
                {
                  data: REPORT_BY_STATUS,
                  highlightScope: { faded: "global", highlighted: "item" },
                },
              ]}
              height={100}
              slotProps={{
                legend: {
                  direction: "row",
                  position: { vertical: "bottom", horizontal: "middle" },
                },
              }}
            />
          </DashboardCard>
        </Grid>

        {/* Second PieChart occupies the rest of the space (2 columns) */}
        <Grid item size={3}>
          <DashboardCard title="Utenti per ruolo">
            <PieChart
              series={[
                {
                  data: USERS_BY_ROLE,
                  highlightScope: { faded: "global", highlighted: "item" },
                },
              ]}
              height={100}
              slotProps={{
                legend: {
                  direction: "row",
                  position: { vertical: "bottom", horizontal: "middle" },
                },
              }}
            />
          </DashboardCard>
        </Grid>
      </Grid>
    </Stack>
  );
}
