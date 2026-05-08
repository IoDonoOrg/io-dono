import {
  blue,
  green,
  purple,
  orange,
  red,
  cyan,
  amber,
  brown,
  blueGrey,
  pink,
} from "@mui/material/colors";

// Colori per le statistiche (grafici)
export const STATS_COLORS = [
  blue[700],
  green[700],
  purple[500],
  orange[800],
  red[700],
  cyan[500],
  amber[500],
  brown[500],
  blueGrey[500],
  pink[500],
];

/* Funzioni per elaborare i dati delle statistiche */
/* Tutte funzioni controllano che i dati non siano nulli o undefined */
/* Se lo sono, restituiscono array vuoti o 0 per evitare errori nei grafici */

// estrae i giorni per il BarChart
// ordina le date in ordine cronologico
export const getChartDays = (itemsReport) =>
  itemsReport
    ? Object.keys(itemsReport.rows).sort((a, b) => new Date(a) - new Date(b))
    : [];

// estrae i tipi di beni per il BarChart e PieChart
export const getChartTypes = (itemsReport) =>
  itemsReport ? Object.keys(itemsReport.totals) : [];

// estrae i top donatori, aspetta che i donatori siano già ordinati
// e filtra quelli con almeno una donazione
export const getTopDonors = (weeklyReport) =>
  weeklyReport
    ? [...weeklyReport.topDonors].filter((d) => d && d.name && d.donationsCount > 0)
    : [];

// calcola il totale dei beni donati, usato per calcolare le percentuali del PieChart
export const getTotalItems = (itemsReport) =>
  itemsReport
    ? Object.values(itemsReport.totals).reduce((sum, v) => sum + v, 0)
    : 0;

// popola il campo series del BarChart con i dati dei beni donati per giorno e tipo
export const getGoodsPerDay = (itemsReport, days, types) =>
  itemsReport
    ? types.map((type, i) => ({
      data: days.map((day) => itemsReport.rows[day]?.[type] ?? 0),
      label: type,
      stack: "main",
      color: STATS_COLORS[i % STATS_COLORS.length],
      highlightScope: { fade: "global", highlight: "item" },
    }))
    : [];

// popola il campo series del PieChart con i dati dei beni donati per tipologia
export const getGoodsPerType = (itemsReport) =>
  itemsReport
    ? Object.entries(itemsReport.totals).map(([label, value], i) => ({
      id: i,
      label,
      value,
      color: STATS_COLORS[i % STATS_COLORS.length],
    }))
    : [];

// popola il campo series del BarChart dei top donatori con i dati delle donazioni per donatore
export const getTopDonorsChart = (topDonors) => [
  {
    data: topDonors.map((d) => d.donationsCount),
    highlightScope: { fade: "global" },
    valueFormatter: (value) => (value == null ? "0" : value.toString()),
  },
];
