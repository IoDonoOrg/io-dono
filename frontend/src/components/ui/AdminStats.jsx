import { Box, Grid, Stack, CircularProgress, Alert } from "@mui/material";
import { BarChart, LineChart, PieChart } from "@mui/x-charts";
import StatCard from "./StatCard";
import DashboardCard from "./DashboardCard";
import { useAdminStats } from "src/hooks/useAdminStats";
import { STATS_COLORS } from "src/utils/statsUtility";

export default function AdminStatistics() {
  const dateRange = {
    fromDate: null,
    toDate: null,
  };

  const {
    overview,
    donationByCategory,
    reportByStatus,
    usersByRole,
    trendData,
    loading,
    error,
  } = useAdminStats(true, dateRange);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Stack spacing={1.5}>
      <Box>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          <StatCard
            label="Donazioni totali"
            value={overview.donations.total}
            sub="Ultimi 30 giorni"
          />
          <StatCard
            label="Segnalazioni totali"
            value={overview.reports.total}
            sub="Relative all'app e alle donazioni"
          />
          <StatCard
            label="Utenti registrati"
            value={overview.usersByRole.reduce((sum, r) => sum + r.count, 0)}
            sub="Donatori, Associazioni, Admin"
          />
        </Stack>
      </Box>

      <DashboardCard title="Trend donazioni (ultimi 30 giorni)">
        <LineChart
          xAxis={[
            {
              scaleType: "point",
              data: trendData.map((d) => d.date),
            },
          ]}
          series={[
            {
              data: trendData.map((d) => d.count),
              area: true,
              curve: "linear",
              color: STATS_COLORS[0],
            },
          ]}
          height={140}
          grid={{ horizontal: true, vertical: true }}
        />
      </DashboardCard>

      <Grid container spacing={1}>
        <Grid item size={6}>
          <DashboardCard title="Donazioni per categoria">
            <BarChart
              xAxis={[
                {
                  scaleType: "band",
                  data: donationByCategory.map((d) => d.label),
                  colorMap: {
                    type: "ordinal",
                    colors: STATS_COLORS,
                  },
                },
              ]}
              yAxis={[{ scaleType: "linear" }]}
              series={[
                {
                  data: donationByCategory.map((d) => d.value),
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
                  data: reportByStatus,
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

        <Grid item size={3}>
          <DashboardCard title="Utenti per ruolo">
            <PieChart
              series={[
                {
                  data: usersByRole,
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
