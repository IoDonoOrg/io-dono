import { MoreVert } from "@mui/icons-material";
import {
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Typography,
} from "@mui/material";
import { useState } from "react";

function DonationBar({
  children,
  status,
  isCompletable = false,
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
    console.log(`${children}: ${action}`);

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
    }

    handleClose();
  };

  const formatStatus = (status) => {
    if (status === "AVAILABLE") return "Attiva";
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
        <Chip
          label={formatStatus(status)}
          color="primary"
          variant="outlined"
          size="small"
        />
        <Typography>{children}</Typography>

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
      </Paper>
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
        <MenuItem key="edit" onClick={() => handleAction("edit")}>
          Modifica
        </MenuItem>
        <MenuItem key="delete" onClick={() => handleAction("delete")}>
          Elimina
        </MenuItem>
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
