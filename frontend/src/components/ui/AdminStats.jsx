import { Box, Grid, Stack, CircularProgress, Alert } from "@mui/material";
import { BarChart, LineChart, PieChart } from "@mui/x-charts";
import StatCard from "./StatCard";
import DashboardCard from "./DashboardCard";
import { useAdminStats } from "src/hooks/useAdminStats";
import { STATS_COLORS } from "src/utils/statsUtility";

export default function AdminStatistics() {
  // utilizza un hook per separare fetching e data processing dal componente
  const {
    overview,
    donationByCategory,
    reportByStatus,
    usersByRole,
    trendData,
    loading,
    error,
  } = useAdminStats(true);

  // mostra un indicatore di caricamento mentre i dati vengono fetchati
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }

  // mostra un messaggio di errore se c'è stato un problema nel fetch dei dati
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

      <DashboardCard title="Trend donazioni (ultimi 30 giorni)" minHeight={150}>
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
          <DashboardCard title="Donazioni per categoria" minHeight={260}>
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
                  highlightScope: { fade: "global", highlight: "item" },
                },
              ]}
              height={200}
              grid={{ horizontal: true }}
            />
          </DashboardCard>
        </Grid>

        <Grid item size={3}>
          <DashboardCard title="Segnalazioni per stato" minHeight={260}>
            <PieChart
              series={[
                {
                  data: reportByStatus,
                  highlightScope: { fade: "global", highlight: "item" },
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
          <DashboardCard title="Utenti per ruolo" minHeight={260}>
            <PieChart
              series={[
                {
                  data: usersByRole,
                  highlightScope: { fade: "global", highlight: "item" },
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
