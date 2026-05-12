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
import { useAuth } from "src/hooks/useAuth";
import { useDonationActions } from "src/hooks/useDonationActions";
import {
  DIALOGS_DONATION_BAR,
  DONATION_MENU_ACTIONS,
  REPORT_TYPES,
} from "src/utils/constants";
import { formatDate, formatStatus, getChipColor } from "src/utils/format";
import CreateDonationDialog from "../form/CreateDonationDialog";
import CompleteDonationDialog from "../form/CompleteDonationDialog";
import CreateReportDialog from "../form/CreateReportDialog";
import ViewDialog from "./ViewDialog";
import DonationView from "./DonationView";

function DonationBar({ donation }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const { user } = useAuth();
  const { handleDelete, handleAccept, openDialog, setOpenDialog } =
    useDonationActions();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handlers = {
    onVisualize: () => setOpenDialog(DIALOGS_DONATION_BAR.VISUALIZE),
    onEdit: () => setOpenDialog(DIALOGS_DONATION_BAR.EDIT),
    onDelete: () => handleDelete(donation._id),
    onAccept: () => handleAccept(donation._id),
    onComplete: () => setOpenDialog(DIALOGS_DONATION_BAR.COMPLETE),
    onReport: () => setOpenDialog(DIALOGS_DONATION_BAR.REPORT),
  };

  const menuContext = {
    role: user.role,
    status: donation.status,
  };

  const visibleActions = DONATION_MENU_ACTIONS.filter(({ condition }) =>
    condition(menuContext),
  );

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
            label={formatStatus(donation.status)}
            color={getChipColor(donation.status)}
            size="small"
          />
          <Divider orientation="vertical" sx={{ height: 30 }} />
        </Box>

        <Typography sx={{ flexGrow: 1, textAlign: "left" }}>
          {`Ritiro: ${formatDate(donation.pickupTime)} - ${donation.items[0]?.name} ${
            donation.items[0]?.quantity
          }, ...`}
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
        {visibleActions.map(({ key, label, onAction }) => (
          <MenuItem
            key={key}
            onClick={() => {
              onAction(handlers);
              handleClose();
            }}
          >
            {label}
          </MenuItem>
        ))}
      </Menu>
      {
        <ViewDialog
          open={openDialog === DIALOGS_DONATION_BAR.VISUALIZE}
          onClose={() => setOpenDialog(null)}
          title="Dettagli donazione"
        >
          <DonationView donation={donation} />
        </ViewDialog>
      }
      {
        <CreateDonationDialog
          open={openDialog === DIALOGS_DONATION_BAR.EDIT}
          onClose={() => setOpenDialog(null)}
          inEditMode={true}
          donation={donation}
        />
      }
      {
        <CompleteDonationDialog
          open={openDialog === DIALOGS_DONATION_BAR.COMPLETE}
          onClose={() => setOpenDialog(null)}
          donation={donation}
        />
      }
      {
        <CreateReportDialog
          open={openDialog === DIALOGS_DONATION_BAR.REPORT}
          onClose={() => setOpenDialog(null)}
          reportType={REPORT_TYPES.DONATION_ISSUE}
          donation={donation}
        />
      }
    </>
  );
}

export default DonationBar;
