import { MoreVert } from "@mui/icons-material";
import {
  Box,
  Chip,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { REPORT_TYPES } from "src/utils/constants";
import {
  formatDate,
  formatReportStatus,
  getReportChipColor,
} from "src/utils/format";

const REPORT_TYPE_LABELS = {
  MALFUNCTION: "App",
  USER_BEHAVIOR: "Donazione",
};

function ReportBar({ report }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [openDialog, setOpenDialog] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const typeLabel = REPORT_TYPE_LABELS[report.type] ?? report.type;

  // Se la segnalazione è di malfunzionamento, non mostrare il nome del segnalato
  const isMalfunction = report.type === REPORT_TYPES.MALFUNCTION;
  const reportedName = report.reportedUserId?.name;

  const handlers = {
    onVisualize: () => setOpenDialog(DIALOGS_REPORT_BAR.VISUALIZE),
  };

  return (
    <Paper
      variant="outlined"
      className="flex justify-between items-center px-4 py-1 w-full"
      sx={{ borderRadius: 50 }}
    >
      <Box
        display="flex"
        alignItems="center"
        className="mr-3"
        gap={1}
        sx={{ width: 120, flexShrink: 0 }}
      >
        <Chip
          label={formatReportStatus(report.status)}
          color={getReportChipColor(report.status)}
          size="small"
        />
        <Chip label={typeLabel} variant="outlined" size="small" />
      </Box>

      <Divider orientation="vertical" sx={{ height: 30, mx: 2 }} />

      <Typography sx={{ flexGrow: 1, textAlign: "left" }}>
        {`${formatDate(report.createdAt)}`}
        {/* Il segnalato viene mostrato solo se la segnalazione non è di malfunzionamento */}
        {!isMalfunction && `, Segnalato: ${reportedName}`}
      </Typography>

      <Box display="flex" alignItems="center" className="ml-3" gap={1}>
        <Divider orientation="vertical" sx={{ height: 30 }} />
        <IconButton
          edge="end"
          color="inherit"
          aria-label="report-options"
          onClick={handleClick}
          aria-controls={open ? "report-menu" : undefined}
          aria-haspopup="true"
        >
          <MoreVert />
        </IconButton>
      </Box>

      <Menu
        id="report-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "center", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <MenuItem onClick={handleClose}>Visualizza dettagli</MenuItem>
      </Menu>
    </Paper>
  );
}

export default ReportBar;
