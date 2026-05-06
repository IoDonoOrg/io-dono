import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
  Divider,
} from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";

import StatCard from "./StatCard";
const COLORS = ["#1976d2", "#2e7d32", "#9c27b0", "#ed6c02", "#d32f2f"];
const TYPES = ["Frutta", "Verdura", "Pane", "Latticini", "Altro"];

const weeklyReport = {
  period: { from: "2025-04-29", to: "2025-05-06" },
  donationsReceived: 24,
  estimatedWasteReduced: 312,
  topDonors: [
    {
      donorId: "1",
      name: "Mario R.",
      email: "mario@example.com",
      donationsCount: 8,
    },
    {
      donorId: "2",
      name: "Sara B.",
      email: "sara@example.com",
      donationsCount: 6,
    },
    {
      donorId: "3",
      name: "Luca M.",
      email: "luca@example.com",
      donationsCount: 5,
    },
    {
      donorId: "4",
      name: "Anna T.",
      email: "anna@example.com",
      donationsCount: 4,
    },
    {
      donorId: "5",
      name: "Giorgio F.",
      email: "giorgio@example.com",
      donationsCount: 3,
    },
  ],
};

const itemsReport = {
  totals: { Frutta: 38, Verdura: 27, Pane: 20, Latticini: 9, Altro: 6 },
  rows: {
    "2025-04-30": { Frutta: 5, Verdura: 3, Pane: 2 },
    "2025-05-01": { Frutta: 7, Verdura: 4, Pane: 3, Latticini: 2 },
    "2025-05-02": { Frutta: 3, Verdura: 5, Pane: 4, Altro: 1 },
    "2025-05-03": { Frutta: 6, Verdura: 2, Pane: 3, Latticini: 3 },
    "2025-05-04": { Frutta: 4, Verdura: 6, Pane: 2, Altro: 2 },
    "2025-05-05": { Frutta: 8, Verdura: 4, Pane: 3, Latticini: 2 },
    "2025-05-06": { Frutta: 5, Verdura: 3, Pane: 3, Altro: 3 },
  },
};

function AssociationStatistics({ open, onClose }) {
  const loading = false;

  const days = Object.keys(itemsReport.rows);

  const stackedSeries = TYPES.map((type, i) => ({
    data: days.map((day) => itemsReport.rows[day][type] ?? 0),
    label: type,
    stack: "main",
    color: COLORS[i],
    highlightScope: { fade: "global", highlight: "item" },
  }));

  const pieData = Object.entries(itemsReport.totals).map(
    ([label, value], i) => ({
      id: i,
      label,
      value,
      color: COLORS[i],
    }),
  );

  const topDonors = [...weeklyReport.topDonors].reverse();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      scroll="paper"
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>
        <Typography
          className="text-center"
          variant="h5"
          gutterBottom
          fontWeight="bold"
        >
          Statistiche
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : (
          <Box display="flex" flexDirection="column" gap={4} py={1}>
            {/* Stat cards */}
            <Box display="flex" gap={2}>
              <StatCard
                label="Donazioni ricevute"
                value={weeklyReport.donationsReceived}
                sub="ultimi 7 giorni"
              />
              <StatCard
                label="Rifiuti stimati ridotti"
                value={`${weeklyReport.estimatedWasteReduced} kg`}
                sub="ultimi 7 giorni"
              />
              <StatCard
                label="Donatori univoci"
                value={weeklyReport.topDonors.length}
                sub="ultimi 7 giorni"
              />
            </Box>

            <Divider orientation="horizontal" flexItem />

            <Box display="flex" gap={1}>
              {/* Top donatori (Stack Bar)*/}
              <Box flex={1} display="flex" flexDirection="column">
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                  align="center"
                >
                  Top donatori
                </Typography>
                <BarChart
                  layout="horizontal"
                  height={220}
                  grid={{ vertical: true }}
                  yAxis={[
                    {
                      data: topDonors.map((d) => d.name),
                      scaleType: "band",
                    },
                  ]}
                  xAxis={[{ label: "Donazioni" }]}
                  series={[
                    {
                      data: topDonors.map((d) => d.donationsCount),
                      highlightScope: { fade: "global", highlight: "item" },
                    },
                  ]}
                  hideLegend
                  margin={{ left: 20 }}
                  borderRadius={4}
                />
              </Box>
              {/* Beni per tipologia (PieChart) */}
              <Box flex={1}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                  align="center"
                >
                  Beni per tipologia
                </Typography>
                <PieChart
                  height={220}
                  series={[
                    {
                      arcLabel: (item) => `${item.value}%`,
                      arcLabelMinAngle: 30,
                      arcLabelRadius: "60%",
                      highlightScope: { fade: "global", highlight: "item" },
                      data: pieData,
                      innerRadius: 15,
                      paddingAngle: 2,
                      cornerRadius: 4,
                    },
                  ]}
                  slotProps={{
                    legend: {
                      direction: "vertical",
                      position: { vertical: "middle", horizontal: "end" },
                    },
                  }}
                />
              </Box>
            </Box>

            <Divider orientation="horizontal" flexItem />
            {/* Beni per giorno (Stack Bar) */}
            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Beni raccolti per giorno
              </Typography>
              <BarChart
                height={250}
                xAxis={[{ data: days, scaleType: "band" }]}
                series={stackedSeries}
                grid={{ horizontal: true }}
                slotProps={{
                  legend: {
                    direction: "horizontal",
                    position: { vertical: "bottom", horizontal: "center" },
                  },
                }}
                margin={{ bottom: 10 }}
              />
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="error">
          Chiudi
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AssociationStatistics;
