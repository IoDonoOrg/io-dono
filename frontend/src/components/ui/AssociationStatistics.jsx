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
  Alert,
} from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";

import StatCard from "./StatCard";
import { useStatistics } from "src/hooks/useStatistics";
import {
  getChartDays,
  getChartTypes,
  getGoodsPerType,
  getGoodsPerDay,
  getTopDonors,
  getTotalItems,
  getTopDonorsChart,
  STATS_COLORS,
} from "src/utils/statsUtility";

function AssociationStatistics({ open, onClose }) {
  const { weeklyReport, itemsReport, loading, error } = useStatistics(open);

  const days = getChartDays(itemsReport);
  const types = getChartTypes(itemsReport);
  const topDonors = getTopDonors(weeklyReport);
  const totalItems = getTotalItems(itemsReport);

  const topDonorsChart = getTopDonorsChart(topDonors);
  const goodsPerType = getGoodsPerType(itemsReport);
  const goodsPerDay = getGoodsPerDay(itemsReport, days, types);

  const getArcLabel = (item) => {
    if (!totalItems || totalItems === 0) return "";
    const pct = Math.round((item.value / totalItems) * 100);
    return `${pct}%`;
  };

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
        ) : error ? (
          <Alert severity="error">{error}</Alert>
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
                      colorMap: {
                        type: "ordinal",
                        colors: STATS_COLORS,
                      },
                    },
                  ]}
                  xAxis={[{ label: "Donazioni" }]}
                  series={topDonorsChart}
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
                      arcLabel: getArcLabel,
                      arcLabelMinAngle: 30,
                      arcLabelRadius: "60%",
                      highlightScope: { fade: "global", highlight: "item" },
                      data: goodsPerType,
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
                series={goodsPerDay}
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
