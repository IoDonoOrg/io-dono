import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import FlagCircleIcon from "@mui/icons-material/FlagCircle";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { useState } from "react";
import { useAuth } from "src/hooks/useAuth";
import ProfileDialog from "./ProfileDialog";

export default function MenuAppBar() {
  const [anchorEl, setAnchorEl] = useState(null);

  const { user, logout } = useAuth();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [openProfileDialog, setOpenProfileDialog] = useState(false);

  const handleOpenProfile = () => {
    setAnchorEl(null); // Close the dropdown menu
    setOpenProfileDialog(true); // Open the dialog
  };

  const handleCloseProfile = () => {
    setOpenProfileDialog(false);
  };

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <div className="grow">
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
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
              <MenuItem onClick={handleOpenProfile}>Profilo</MenuItem>
              <MenuItem onClick={logout}>Logout</MenuItem>
            </Menu>
          </div>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <FlagCircleIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <ProfileDialog
        open={openProfileDialog}
        onClose={handleCloseProfile}
        user={user}
      />
    </Box>
  );
}
