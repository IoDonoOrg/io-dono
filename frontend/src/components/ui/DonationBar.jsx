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
import { DONATION_STATUS } from "src/utils/constants";
import { formatStatus } from "src/utils/format";

function DonationBar({
  children,
  status,
  isCompletable = false,
  isModifieble = true,
  onVisualize,
  onEdit,
  onDelete,
  onComplete,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAction = (action) => {
    // console.log(`${children}: ${action}`);

    switch (action) {
      case "edit":
        onEdit();
        break;
      case "delete":
        onDelete();
        break;
      case "complete":
        onComplete();
        break;
      case "visualize":
        onVisualize();
        break;
    }

    handleClose();
  };

  // Determina il colore del chip in base allo stato della donazione
  const getChipColor = (status) => {
    switch (status) {
      case DONATION_STATUS.AVAILABLE:
        return "success"; // verde
      case DONATION_STATUS.ACCEPTED:
        return "warning"; // arancione
      case DONATION_STATUS.COMPLETED:
        return "info"; // blu
      case DONATION_STATUS.CANCELLED:
        return "error"; // rosso
      case DONATION_STATUS.NO_STATUS:
      default:
        return "default"; // grigio
    }
  };

  return (
    <>
      <Paper
        variant="outlined"
        className="flex justify-between items-center px-4 py-1 w-full"
        sx={{
          borderRadius: 50,
        }}
      >
        <Box display="flex" alignItems="center" className="mr-3" gap={1}>
          <Chip
            label={formatStatus(status)}
            color={getChipColor(status)}
            size="small"
          />
          <Divider orientation="vertical" sx={{ height: 30 }} />
        </Box>

        <Typography sx={{ flexGrow: 1, textAlign: "left" }}>
          {children}
        </Typography>

        <Box display="flex" alignItems="center" className="ml-3" gap={1}>
          <Divider orientation="vertical" sx={{ height: 30 }} />
          <IconButton
            edge="end"
            color="inherit"
            aria-label="settings"
            onClick={handleClick}
            aria-controls={open ? "donation-menu" : undefined}
            aria-haspopup="true"
          >
            <MoreVert />
          </IconButton>
        </Box>
      </Paper>
      {/* Menu con 3 puntini */}
      <Menu
        id="donation-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "center",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <MenuItem key="visualize" onClick={() => handleAction("visualize")}>
          Visualizza
        </MenuItem>
        {isModifieble && (
          <MenuItem key="edit" onClick={() => handleAction("edit")}>
            Modifica
          </MenuItem>
        )}
        {isModifieble && (
          <MenuItem key="delete" onClick={() => handleAction("delete")}>
            Elimina
          </MenuItem>
        )}
        {isCompletable && (
          <MenuItem key="complete" onClick={() => handleAction("complete")}>
            Completa
          </MenuItem>
        )}
      </Menu>
    </>
  );
}

export default DonationBar;
