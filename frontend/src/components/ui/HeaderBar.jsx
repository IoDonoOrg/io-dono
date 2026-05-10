import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import FlagCircleIcon from "@mui/icons-material/FlagCircle";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { useState } from "react";
import { useAuth } from "src/hooks/useAuth";
import ProfileDialog from "./ProfileDialog";
import CreateReportDialog from "../form/CreateReportDialog";
import { REPORT_TYPES } from "src/utils/constants";

export default function MenuAppBar() {
  const [anchorEl, setAnchorEl] = useState(null);
  // openDialog può assumere {"profile", "report", "viewReports"}
  const [openDialog, setOpenDialog] = useState(null);

  const { user, logout } = useAuth();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [anchorElReport, setAnchorElReport] = useState(null);

  const handleReportMenu = (event) => {
    setAnchorElReport(event.currentTarget);
  };

  const handleCloseReportMenu = () => {
    setAnchorElReport(null);
  };

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <div className="grow">
            <Box display="flex" alignItems="center">
              <IconButton
                size="large"
                aria-label="menu-profilo"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Typography variant="body2" sx={{ ml: 1 }}>
                {user?.name}
              </Typography>
            </Box>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={() => setOpenDialog("profile")}>
                Profilo
              </MenuItem>
              <MenuItem onClick={logout}>Logout</MenuItem>
            </Menu>
          </div>
          <IconButton
            size="large"
            aria-label="menu-segnalazioni"
            aria-controls="menu-appbar-report"
            aria-haspopup="true"
            onClick={handleReportMenu}
            color="inherit"
          >
            <FlagCircleIcon />
          </IconButton>
          <Menu
            id="menu-appbar-report"
            anchorEl={anchorElReport}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorElReport)}
            onClose={handleCloseReportMenu}
          >
            <MenuItem onClick={() => setOpenDialog("report")}>
              Segnala malfunzionamento
            </MenuItem>
            <MenuItem onClick={handleCloseReportMenu}>
              Visualizza segnalazioni
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <ProfileDialog
        open={openDialog === "profile"}
        onClose={() => setOpenDialog(null)}
        user={user}
      />
      <CreateReportDialog
        open={openDialog === "report"}
        onClose={() => setOpenDialog(null)}
        reportType={REPORT_TYPES.MALFUNCTION}
        userID={user._id}
      />
    </Box>
  );
}
